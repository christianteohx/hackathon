-- Harden vote/judge integrity for scoring pipeline

-- Add voter attribution on votes
ALTER TABLE public.votes
ADD COLUMN IF NOT EXISTS created_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Backfill from existing session_id values when they are UUIDs
UPDATE public.votes
SET created_by_user_id = session_id::uuid
WHERE created_by_user_id IS NULL
  AND session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

-- Unique vote per voter per project-pair (canonicalized order)
CREATE UNIQUE INDEX IF NOT EXISTS votes_unique_voter_pair_idx
ON public.votes (
  COALESCE(created_by_user_id::text, session_id, ''),
  LEAST(left_project_id, right_project_id),
  GREATEST(left_project_id, right_project_id)
);

-- Helpful indexes for leaderboard and judge aggregation
CREATE INDEX IF NOT EXISTS votes_winner_project_idx ON public.votes (winner_project_id);
CREATE INDEX IF NOT EXISTS judge_scores_project_idx ON public.judge_scores (project_id);

-- Keep project references sane inside vote rows
ALTER TABLE public.votes
DROP CONSTRAINT IF EXISTS votes_winner_in_pair_check;

ALTER TABLE public.votes
ADD CONSTRAINT votes_winner_in_pair_check
CHECK (winner_project_id = left_project_id OR winner_project_id = right_project_id);
