# Vertex AI Integration

This project uses Google Cloud Vertex AI to generate AI-powered pitches for hackathon projects.

## Setup

### 1. Google Cloud Project

1. Create a Google Cloud project at https://console.cloud.google.com
2. Enable the Vertex AI API:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

### 2. Authentication

Set up authentication by either:

**Option A: Service Account (Recommended for production)**
```bash
gcloud iam service-accounts create hackathon-ai
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:hackathon-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
gcloud iam service-accounts keys create key.json \
  --iam-account=hackathon-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
export GOOGLE_APPLICATION_CREDENTIALS="./key.json"
```

**Option B: User Credentials (Development)**
```bash
gcloud auth application-default login
```

### 3. Environment Variables

Update `.env.local` with your Google Cloud project details:

```bash
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

### 4. Install Dependencies

The Vertex AI SDK is already installed:
```bash
npm install @google-cloud/vertexai
```

## Usage

### API Endpoint

Generate pitches by POSTing to `/api/pitch`:

```bash
curl -X POST http://localhost:3000/api/pitch \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "My Awesome Project",
    "tagline": "Revolutionizing the way we work",
    "description": "A platform that uses AI to optimize workflow efficiency..."
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "oneLinePitch": "My Awesome Project: Revolutionizing workflow with AI-powered optimization",
    "audiencePitch": "My Awesome Project transforms how teams work by leveraging cutting-edge AI technology. It's designed to boost productivity and streamline collaboration in ways you've never experienced before.",
    "judgePitch": "My Awesome Project represents a sophisticated approach to workflow optimization using advanced machine learning algorithms. The technical implementation demonstrates strong engineering practices with scalable architecture. Market analysis indicates significant demand for AI-driven productivity tools, positioning this project for real-world impact and potential commercial success."
  }
}
```

### Programmatic Usage

```typescript
import { generatePitches } from '@/lib/vertex-ai';

const pitches = await generatePitches({
  projectName: "My Project",
  tagline: "Amazing tagline",
  description: "Project description..."
});

console.log(pitches.oneLinePitch);
console.log(pitches.audiencePitch);
console.log(pitches.judgePitch);
```

## Features

The AI generates three types of pitches:

1. **One-Line Pitch**: A catchy, memorable one-liner (max 15 words)
2. **Audience Pitch**: An engaging 2-3 sentence pitch for general audiences
3. **Judge Pitch**: A technical and business-focused 3-4 sentence pitch for judges

## Model

The system uses `gemini-1.5-flash-001` for fast, cost-effective pitch generation with high quality output.

## Fallback Behavior

If Vertex AI is unavailable or fails, the system provides sensible fallback pitches based on the project details to ensure the application remains functional.

---

## AI Judge Endpoint

### Generate Judge Feedback
POST to `/api/judge` to get AI judge evaluation:

```bash
curl -X POST http://localhost:3000/api/judge \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "My Awesome Project",
    "tagline": "Revolutionizing the way we work",
    "description": "A platform that uses AI to optimize workflow efficiency...",
    "demoUrl": "https://demo.example.com",
    "githubUrl": "https://github.com/example/project"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "score": 87,
    "verdict": "This project demonstrates strong technical execution and clear market potential with innovative use of AI.",
    "strengths": [
      "Clear problem-solution fit with strong value proposition",
      "Well-architected technical implementation using modern frameworks",
      "Demonstrable impact on target market efficiency"
    ],
    "concerns": [
      "Competitive landscape analysis could be more thorough",
      "Scalability considerations for high-volume usage need refinement",
      "User onboarding flow requires further optimization"
    ]
  }
}
```

### Programmatic Usage
```typescript
import { generateJudgeFeedback } from '@/lib/judge-ai';

const feedback = await generateJudgeFeedback({
  projectName: "My Project",
  tagline: "Amazing tagline",
  description: "Project description...",
  demoUrl: "https://demo.example.com",
  githubUrl: "https://github.com/example/project"
});

console.log(feedback.score);        // 87
console.log(feedback.verdict);      // Overall verdict statement
console.log(feedback.strengths);    // Array of 3 strengths
console.log(feedback.concerns);     // Array of 3 concerns
```

### Evaluation Criteria
The AI judge evaluates projects based on:
1. **Innovation and creativity** - How novel and creative is the solution?
2. **Technical implementation** - Quality and complexity of the technical approach
3. **Problem-solution fit** - Does it solve a real problem effectively?
4. **Potential impact** - Market opportunity and scalability
5. **Presentation quality** - Clarity of communication and documentation

### Output Format
- **score**: Number between 1-100 representing overall project quality
- **verdict**: Concise overall assessment (1-2 sentences)
- **strengths**: Array of 3 key strengths identified
- **concerns**: Array of 3 areas for improvement or potential weaknesses
