import { VertexAI, GenerationConfig } from '@google-cloud/vertexai';

interface JudgeFeedback {
  score: number;
  verdict: string;
  strengths: string[];
  concerns: string[];
}

interface ProjectForJudging {
  projectName: string;
  tagline: string;
  description: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
}

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

const model = 'gemini-1.5-flash-001';

const generationConfig: GenerationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1024,
};

/**
 * Generates AI judge feedback for a hackathon project using Vertex AI
 * @param project - Project details to evaluate
 * @returns Promise<JudgeFeedback> - Score, verdict, strengths, and concerns
 */
export async function generateJudgeFeedback(
  project: ProjectForJudging
): Promise<JudgeFeedback> {
  try {
    const prompt = `You are a professional hackathon judge with expertise in technology, business, and innovation. Evaluate the following project critically and fairly.

Project Details:
- Project Name: ${project.projectName}
- Tagline: ${project.tagline}
- Description: ${project.description}
${project.demoUrl ? `- Demo URL: ${project.demoUrl}` : ''}
${project.githubUrl ? `- GitHub URL: ${project.githubUrl}` : ''}

Evaluate this project based on:
1. Innovation and creativity
2. Technical implementation and complexity
3. Problem-solution fit
4. Potential impact and market opportunity
5. Presentation quality (based on description clarity)

Return ONLY valid JSON with no markdown formatting, no explanations, and no extra text. The response must be parseable JSON with these exact keys:
{
  "score": <number between 1-100>,
  "verdict": "<string: A concise overall verdict statement (1-2 sentences)>",
  "strengths": ["<string: strength 1>", "<string: strength 2>", "<string: strength 3>"],
  "concerns": ["<string: concern 1>", "<string: concern 2>", "<string: concern 3>"]
}

Be honest and constructive. The score should reflect a realistic assessment. Strengths should highlight what the project does well. Concerns should point out areas for improvement or potential weaknesses.`;

    const modelClient = vertexAI.getGenerativeModel({
      model,
      generationConfig,
    });

    const result = await modelClient.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean the response to extract JSON
    let jsonText = text.trim();

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Parse the JSON
    const feedback = JSON.parse(jsonText) as JudgeFeedback;

    // Validate the response structure
    if (
      typeof feedback.score !== 'number' ||
      feedback.score < 1 ||
      feedback.score > 100 ||
      !feedback.verdict ||
      !Array.isArray(feedback.strengths) ||
      !Array.isArray(feedback.concerns)
    ) {
      throw new Error('Invalid feedback structure from Vertex AI');
    }

    return feedback;
  } catch (error) {
    console.error('Error generating judge feedback:', error);

    // Fallback feedback if Vertex AI fails
    return {
      score: 75,
      verdict: `${project.projectName} shows promise with a solid approach to solving the stated problem.`,
      strengths: [
        'Clear problem statement and solution approach',
        'Good use of modern technology stack',
        'Potential for real-world impact',
      ],
      concerns: [
        'Consider expanding on technical implementation details',
        'Market research could be more thorough',
        'User experience considerations need further exploration',
      ],
    };
  }
}
