-- Add is_featured column to projects table
ALTER TABLE public.projects
ADD COLUMN is_featured boolean NOT NULL DEFAULT FALSE;

-- Add announcements column to hackathons table
ALTER TABLE public.hackathons
ADD COLUMN announcements text;

-- Add voting_deadline to hackathons if not exists (may already exist)
-- Note: voting_deadline was likely added separately, checking if column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hackathons' AND column_name = 'voting_deadline'
  ) THEN
    ALTER TABLE public.hackathons ADD COLUMN voting_deadline timestamptz;
  END IF;
END $$;

-- Update the dummy hackathon with a default announcement if needed
-- (optional, can be set by admin later)

-- Allow anon/authenticated to read featured status
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy for is_featured read
CREATE POLICY "Enable read for is_featured" ON public.projects FOR SELECT USING (true);
