
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  left_project_id uuid not null references public.projects (id) on delete cascade,
  right_project_id uuid not null references public.projects (id) on delete cascade,
  winner_project_id uuid not null references public.projects (id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now()
);

alter table public.votes enable row level security;

create policy "votes_insert_authenticated"
on public.votes
for insert
to authenticated
with check (true);

create policy "votes_select_all"
on public.votes
for select
to authenticated, anon
using (true);
