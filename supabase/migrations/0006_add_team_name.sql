-- Add team_name column to projects table
-- This field stores the team name associated with each project

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS team_name text;

-- Add a comment to document the new field
COMMENT ON COLUMN public.projects.team_name IS 'Name of the team that created this project';

-- Update existing seed projects with team names (will be set when seed data is inserted)
-- Note: This migration doesn't update existing data since team_name is optional
-- The seed.sql file should include team_name values when inserting projects
