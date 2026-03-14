# Hackathon Platform

Minimal Next.js 14 + TypeScript + Tailwind + Supabase app for:

- login with Supabase email magic link
- create user profile on first sign-in
- create project / join project by code
- edit project as owner
- move between `/my` and `/vote`

## Install dependencies

```bash
npm install
```

## Required environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase setup

1. Run these SQL files in order:
   - `supabase/migrations/0001_init_projects.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/ping.sql`
2. In Supabase Auth settings, enable email sign-in.
3. Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - your deployed Vercel URL + `/auth/callback`

`/api/test-db` calls `rpc("ping")` and returns success or failure.

## Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Important routes:

- `/login`
- `/my`
- `/project/create`
- `/project/join`
- `/vote`
- `/api/me/project`
- `/api/health`
- `/api/test-db`

## Manual smoke checklist

1. Open `/login` and request a magic link.
2. Complete auth and land on `/my`.
3. Save `display_name` on first sign-in.
4. Create a project or join one with a code.
5. Confirm `/my` shows project info and join code.
6. Confirm owner can edit and save.
7. Confirm `/my` and `/vote` link to each other.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Set the Vercel deployment URL in Supabase Auth redirect settings.
5. Run the SQL files above in your Supabase project if you have not already.
6. Deploy.
