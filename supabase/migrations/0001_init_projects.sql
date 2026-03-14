create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text not null default '',
  description text not null default '',
  demo_url text,
  github_url text,
  join_code text not null unique,
  created_by_user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  unique (user_id),
  unique (project_id, user_id)
);

create or replace function public.find_project_by_join_code(input_join_code text)
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from public.projects
  where join_code = upper(trim(input_join_code))
  limit 1;
$$;

grant execute on function public.find_project_by_join_code(text) to authenticated;
