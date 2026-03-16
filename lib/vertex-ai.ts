import { VertexAI, GenerationConfig } from '@google-cloud/vertexai';

interface PitchResult {
  oneLinePitch: string;
  audiencePitch: string;
  judgePitch: string;
}

interface ProjectDetails {
  projectName: string;
  tagline: string;
  description: string;
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
 * Generates AI pitches for a hackathon project using Vertex AI
 * @param project - Project details including name, tagline, and description
 * @returns Promise<PitchResult> - Generated one-line pitch, audience pitch, and judge pitch
 */
export async function generatePitches(project: ProjectDetails): Promise<PitchResult> {
  try {
    const prompt = `You are a helpful assistant that generates compelling pitch content for hackathon projects.

Project Details:
- Project Name: ${project.projectName}
- Tagline: ${project.tagline}
- Description: ${project.description}

Generate the following three pitches in JSON format with these exact keys:
1. "oneLinePitch": A catchy one-line pitch (max 15 words) that captures the essence of the project
2. "audiencePitch": A short, engaging pitch for general audience (2-3 sentences) that explains what the project does and why it's exciting
3. "judgePitch": A more technical and business-focused pitch for judges (3-4 sentences) that highlights innovation, technical implementation, and potential impact

IMPORTANT: Return ONLY valid JSON with no markdown formatting, no explanations, and no extra text. The response must be parseable JSON.

Example format:
{
  "oneLinePitch": "Your one-line pitch here",
  "audiencePitch": "Your audience pitch here",
  "judgePitch": "Your judge pitch here"
}`;

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
    const pitches = JSON.parse(jsonText) as PitchResult;

    return pitches;
  } catch (error) {
    console.error('Error generating pitches:', error);
    
    // Fallback pitches if Vertex AI fails
    return {
      oneLinePitch: `${project.projectName}: ${project.tagline}`,
      audiencePitch: `${project.projectName} is an innovative solution that ${project.description.toLowerCase()}. It's designed to make a real difference by ${project.tagline.toLowerCase()}.`,
      judgePitch: `${project.projectName} represents a thoughtful approach to solving real-world problems. The technical implementation demonstrates solid engineering practices, and the potential impact aligns with current market needs. This project shows promise for further development and real-world application.`,
    };
  }
}

/**
 * Generates a single-line pitch only
 */
export async function generateOneLinePitch(project: ProjectDetails): Promise<string> {
  const pitches = await generatePitches(project);
  return pitches.oneLinePitch;
}
