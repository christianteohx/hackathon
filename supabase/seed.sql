-- Seed script to insert mock projects into Supabase
-- Run this with: supabase db execute --file supabase/seed.sql
-- Or manually in the Supabase SQL Editor

-- First, ensure we have a way to identify seed data
-- We'll use specific UUIDs for reproducibility

-- Insert seed projects (these UUIDs are fixed for consistency)
INSERT INTO public.projects (id, name, tagline, description, demo_url, github_url, join_code, created_by_user_id, created_at, updated_at)
VALUES 
  ('proj-aurora', 'Aurora Notes', 'Never miss an action item again', 'AI-powered meeting notes that automatically extract action items, assign owners, and track deadlines in real-time. Integrates with Zoom, Google Meet, and Teams. Built with Next.js, Whisper API, and Supabase.', 'https://aurora-notes-demo.vercel.app', 'https://github.com/teamnorth/aurora-notes', 'AURORA24', NULL, now(), now()),
  ('proj-pulse', 'Pulse Grid', 'Navigate the city smarter', 'Real-time city transit visualization with ML-powered crowd density predictions and delay forecasting. Uses historical data to predict congestion 30 minutes ahead. Tech stack: React Native, Node.js, PostgreSQL, and TensorFlow Lite.', 'https://pulsegrid.io/demo', 'https://github.com/teameast/pulse-grid', 'PULSE11', NULL, now(), now()),
  ('proj-sprout', 'Sprout Lab', 'Make climate action fun', 'Platform that turns environmental challenges into competitive games for communities and classrooms. Track carbon savings, earn badges, and compete on leaderboards. Built with Vue.js, Firebase, and Stripe for donations.', 'https://sproutlab.green/playground', 'https://github.com/teangreen/sprout-lab', 'SPROUT7', NULL, now(), now()),
  ('proj-fjord', 'Fjord Finance', 'Your AI financial coach', 'AI-powered personal finance assistant that explains every savings recommendation with clear reasoning. Connects to bank accounts via Plaid and provides actionable insights. Stack: Next.js, Python/FastAPI, Plaid API, and OpenAI.', 'https://fjordfinance.app/demo', 'https://github.com/teamwest/fjord-finance', 'FJORD99', NULL, now(), now()),
  ('proj-nexus', 'Nexus Health', 'One view of your health data', 'Centralized health platform that aggregates data from Apple Health, Fitbit, Garmin, and electronic health records. Provides AI-powered insights and trend analysis. Built with React, GraphQL, FHIR standards, and HIPAA-compliant infrastructure.', 'https://nexushealth.io/preview', 'https://github.com/phoenixteam/nexus-health', 'NEXUS42', NULL, now(), now()),
  ('proj-echo', 'Echo Learn', 'Speak confidently from day one', 'Language learning app with AI pronunciation coaching that gives instant feedback on accent, intonation, and fluency. Supports 15 languages with personalized learning paths. Tech: React Native, WebAssembly for audio processing, and fine-tuned Whisper models.', 'https://echolearn.app/trial', 'https://github.com/linguistteam/echo-learn', 'ECHO88', NULL, now(), now()),
  ('proj-vertex', 'Vertex AI', 'Build AI without coding', 'Drag-and-drop platform for creating custom ML models without writing code. Pre-built templates for churn prediction, demand forecasting, and sentiment analysis. Built with Python, Streamlit, Hugging Face transformers, and AWS SageMaker.', 'https://vertex-ai.build/demo', 'https://github.com/vertexteam/vertex-ai', 'VERTEX1', NULL, now(), now()),
  ('proj-haven', 'Haven Space', 'Protect what matters, privately', 'Home security system that processes all video locally for privacy. Detects unusual activity, monitors elderly relatives, and alerts only when needed. Edge computing with Raspberry Pi, OpenCV, and on-device ML. No cloud video storage.', 'https://havespace.home/demo', 'https://github.com/sentinelteam/haven-space', 'HAVEN77', NULL, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Note: created_by_user_id is NULL for seed data since we don't have real users
-- This is okay for a hackathon demo where projects are pre-populated

-- Add a comment to mark these as seed data
COMMENT ON TABLE public.projects IS 'Seed projects for hackathon demo. Delete and re-run seed script to reset.';
