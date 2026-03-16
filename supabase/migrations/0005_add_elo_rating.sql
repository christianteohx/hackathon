-- Add Elo rating to projects table
alter table public.projects 
add column if not exists elo_rating numeric not null default 1200;

-- Add index for better leaderboard performance
create index if not exists idx_projects_elo_rating 
on public.projects (elo_rating desc);
