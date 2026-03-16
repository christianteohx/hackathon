import { Project, VotePair } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-aurora",
    name: "Aurora Notes",
    summary: "AI meeting notes that auto-build action items in real time.",
    tagline: "Never miss an action item again",
    owner: "Team North",
    joinCode: "AURORA24",
    description: "AI-powered meeting notes that automatically extract action items, assign owners, and track deadlines in real-time. Integrates with Zoom, Google Meet, and Teams. Built with Next.js, Whisper API, and Supabase.",
    demo_url: "https://aurora-notes-demo.vercel.app",
    github_url: "https://github.com/teamnorth/aurora-notes"
  },
  {
    id: "proj-pulse",
    name: "Pulse Grid",
    summary: "Live city transit map with predictive crowd and delay overlays.",
    tagline: "Navigate the city smarter",
    owner: "Team East",
    joinCode: "PULSE11",
    description: "Real-time city transit visualization with ML-powered crowd density predictions and delay forecasting. Uses historical data to predict congestion 30 minutes ahead. Tech stack: React Native, Node.js, PostgreSQL, and TensorFlow Lite.",
    demo_url: "https://pulsegrid.io/demo",
    github_url: "https://github.com/teameast/pulse-grid"
  },
  {
    id: "proj-sprout",
    name: "Sprout Lab",
    summary: "Gamified climate challenges for neighborhoods and schools.",
    tagline: "Make climate action fun",
    owner: "Team Green",
    joinCode: "SPROUT7",
    description: "Platform that turns environmental challenges into competitive games for communities and classrooms. Track carbon savings, earn badges, and compete on leaderboards. Built with Vue.js, Firebase, and Stripe for donations.",
    demo_url: "https://sproutlab.green/playground",
    github_url: "https://github.com/teangreen/sprout-lab"
  },
  {
    id: "proj-fjord",
    name: "Fjord Finance",
    summary: "Personal finance coaching with explainable savings suggestions.",
    tagline: "Your AI financial coach",
    owner: "Team West",
    joinCode: "FJORD99",
    description: "AI-powered personal finance assistant that explains every savings recommendation with clear reasoning. Connects to bank accounts via Plaid and provides actionable insights. Stack: Next.js, Python/FastAPI, Plaid API, and OpenAI.",
    demo_url: "https://fjordfinance.app/demo",
    github_url: "https://github.com/teamwest/fjord-finance"
  },
  {
    id: "proj-nexus",
    name: "Nexus Health",
    summary: "Unified health dashboard connecting wearables and EHR systems.",
    tagline: "One view of your health data",
    owner: "Team Phoenix",
    joinCode: "NEXUS42",
    description: "Centralized health platform that aggregates data from Apple Health, Fitbit, Garmin, and electronic health records. Provides AI-powered insights and trend analysis. Built with React, GraphQL, FHIR standards, and HIPAA-compliant infrastructure.",
    demo_url: "https://nexushealth.io/preview",
    github_url: "https://github.com/phoenixteam/nexus-health"
  },
  {
    id: "proj-echo",
    name: "Echo Learn",
    summary: "Adaptive language learning with real-time pronunciation feedback.",
    tagline: "Speak confidently from day one",
    owner: "Team Linguist",
    joinCode: "ECHO88",
    description: "Language learning app with AI pronunciation coaching that gives instant feedback on accent, intonation, and fluency. Supports 15 languages with personalized learning paths. Tech: React Native, WebAssembly for audio processing, and fine-tuned Whisper models.",
    demo_url: "https://echolearn.app/trial",
    github_url: "https://github.com/linguistteam/echo-learn"
  },
  {
    id: "proj-vertex",
    name: "Vertex AI",
    summary: "No-code ML model builder for business users.",
    tagline: "Build AI without coding",
    owner: "Team Vertex",
    joinCode: "VERTEX1",
    description: "Drag-and-drop platform for creating custom ML models without writing code. Pre-built templates for churn prediction, demand forecasting, and sentiment analysis. Built with Python, Streamlit, Hugging Face transformers, and AWS SageMaker.",
    demo_url: "https://vertex-ai.build/demo",
    github_url: "https://github.com/vertexteam/vertex-ai"
  },
  {
    id: "proj-haven",
    name: "Haven Space",
    summary: "Smart home safety monitoring with privacy-first design.",
    tagline: "Protect what matters, privately",
    owner: "Team Sentinel",
    joinCode: "HAVEN77",
    description: "Home security system that processes all video locally for privacy. Detects unusual activity, monitors elderly relatives, and alerts only when needed. Edge computing with Raspberry Pi, OpenCV, and on-device ML. No cloud video storage.",
    demo_url: "https://havespace.home/demo",
    github_url: "https://github.com/sentinelteam/haven-space"
  }
];

export function buildVotePairs(projects: Project[]): VotePair[] {
  const pairs: VotePair[] = [];
  for (let i = 0; i < projects.length; i += 1) {
    for (let j = i + 1; j < projects.length; j += 1) {
      const left = projects[i];
      const right = projects[j];
      pairs.push({
        id: `${left.id}__${right.id}`,
        leftProjectId: left.id,
        rightProjectId: right.id
      });
    }
  }
  return pairs;
}
