# Hackathon Skeleton

Minimal Next.js 14 + TypeScript + Tailwind + Supabase starter to verify:

- frontend renders
- backend API works
- Supabase connection works

## Install dependencies

```bash
npm install
```

## Required environment variables

Create `.env.local`:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase setup

Run the SQL in `supabase/ping.sql` in the Supabase SQL editor.  
`/api/test-db` calls `rpc("ping")`, and that function simply runs `select 1`.

## Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

- `/` renders the frontend
- `/api/health` returns `{ "status": "ok" }`
- `/api/test-db` returns success or failure for the Supabase connection

## Deploy to Vercel

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel project settings.
4. Run the SQL from `supabase/ping.sql` in your Supabase project if you have not already.
5. Deploy.
