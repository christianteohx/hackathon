-- Seed script to insert mock projects into Supabase
-- Run this in the Supabase SQL Editor

INSERT INTO public.projects (id, name, team_name, tagline, description, demo_url, github_url, join_code, elo_rating, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Aurora Notes', 'Team North', 'Never miss an action item again', 'AI-powered meeting notes that automatically extract action items, assign owners, and track deadlines in real-time.', 'https://aurora-notes-demo.vercel.app', 'https://github.com/teamnorth/aurora-notes', 'AURORA24', 1200, now(), now()),
(gen_random_uuid(), 'Pulse Grid', 'Team East', 'Navigate the city smarter', 'Real-time city transit visualization with ML-powered crowd density predictions.', 'https://pulsegrid.io/demo', 'https://github.com/teameast/pulse-grid', 'PULSE11', 1200, now(), now()),
(gen_random_uuid(), 'Sprout Lab', 'Team Green', 'Make climate action fun', 'Platform that turns environmental challenges into competitive games.', 'https://sproutlab.green/playground', 'https://github.com/teangreen/sprout-lab', 'SPROUT7', 1200, now(), now()),
(gen_random_uuid(), 'Fjord Finance', 'Team West', 'Your AI financial coach', 'AI-powered personal finance assistant with explainable savings suggestions.', 'https://fjordfinance.app/demo', 'https://github.com/teamwest/fjord-finance', 'FJORD99', 1200, now(), now()),
(gen_random_uuid(), 'Nexus Health', 'Team Phoenix', 'One view of your health data', 'Centralized health platform aggregating wearables and EHR data.', 'https://nexushealth.io/preview', 'https://github.com/phoenixteam/nexus-health', 'NEXUS42', 1200, now(), now()),
(gen_random_uuid(), 'Echo Learn', 'Team Linguist', 'Speak confidently from day one', 'Adaptive language learning with real-time pronunciation feedback.', 'https://echolearn.app/trial', 'https://github.com/linguistteam/echo-learn', 'ECHO88', 1200, now(), now()),
(gen_random_uuid(), 'Vertex AI', 'Team Vertex', 'Build AI without coding', 'No-code ML model builder for business users.', 'https://vertex-ai.build/demo', 'https://github.com/vertexteam/vertex-ai', 'VERTEX1', 1200, now(), now()),
(gen_random_uuid(), 'Haven Space', 'Team Sentinel', 'Protect what matters privately', 'Privacy-first smart home security with local video processing.', 'https://havespace.home/demo', 'https://github.com/sentinelteam/haven-space', 'HAVEN77', 1200, now(), now());