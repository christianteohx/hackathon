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
