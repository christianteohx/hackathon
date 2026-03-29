# Hackathon Voting Platform — Deployment Guide

## Prerequisites
- Node.js 18+ installed
- A Vercel account (sign up at vercel.com)
- A Supabase account (sign up at supabase.com)

---

## 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once created, go to **Settings → API** to find:
   - **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In the Supabase SQL Editor, run the following to create the required tables:

```sql
-- Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  team_name text not null,
  project_name text not null,
  tagline text not null,
  description text not null,
  demo_url text,
  github_url text,
  created_at timestamp with time zone default now()
);

-- Votes table
create table votes (
  id uuid default gen_random_uuid() primary key,
  left_project_id uuid references projects(id),
  right_project_id uuid references projects(id),
  winner_project_id uuid references projects(id),
  session_id text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS) as needed
alter table projects enable row level security;
alter table votes enable row level security;
```

---

## 2. Deploy to Vercel

### Option A: Via GitHub (Recommended)

1. Push your project to GitHub if you haven't already:
   ```bash
   cd hackathon
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create hackathon --public --push
   ```

2. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.

3. On the **Environment Variables** screen, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

4. Click **Deploy**. Vercel will automatically detect Next.js and use the `vercel.json` configuration.

### Option B: Via Vercel CLI

```bash
npm install -g vercel
cd hackathon
vercel
```

Follow the prompts and add environment variables when asked.

---

## 3. Add Environment Variables in Vercel Dashboard

If you deployed via GitHub or CLI and need to update env vars:

1. Go to your project on [vercel.com/dashboard](https://vercel.com/dashboard).
2. Click **Settings** → **Environment Variables**.
3. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
4. For changes to take effect on an existing deployment, go to **Deployments**, find the latest, click **⋯** → **Redeploy**.

---

## 4. Verify Deployment

After deploying, visit your Vercel URL (e.g., `https://your-project.vercel.app`). You should see the hackathon voting platform loading.

If you see errors:
- Check the Vercel deployment logs for runtime errors.
- Verify environment variables are set correctly in the Vercel dashboard.
- Make sure your Supabase project is not paused (Supabase free tier pauses projects after inactivity).
