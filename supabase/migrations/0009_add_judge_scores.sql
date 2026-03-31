-- Add submission_deadline and voting_deadline columns to hackathons table
ALTER TABLE public.hackathons
ADD COLUMN IF NOT EXISTS submission_deadline timestamptz,
ADD COLUMN IF NOT EXISTS voting_deadline timestamptz;

-- Create judge_scores table for the judging panel
CREATE TABLE public.judge_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    judge_name text NOT NULL,
    innovation integer NOT NULL CHECK (innovation >= 1 AND innovation <= 10),
    technical integer NOT NULL CHECK (technical >= 1 AND technical <= 10),
    presentation integer NOT NULL CHECK (presentation >= 1 AND presentation <= 10),
    impact integer NOT NULL CHECK (impact >= 1 AND impact <= 10),
    feedback text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.judge_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies for judge_scores
-- Anyone can read judge scores (judges should be able to see aggregate scores)
CREATE POLICY "Enable read access for all users on judge_scores" ON public.judge_scores
FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete scores
CREATE POLICY "Allow authenticated users to insert judge scores" ON public.judge_scores
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update judge scores" ON public.judge_scores
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete judge scores" ON public.judge_scores
FOR DELETE USING (auth.uid() IS NOT NULL);
