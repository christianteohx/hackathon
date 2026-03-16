# Hackathon Project Voting UI

Next.js 14 + TypeScript + Tailwind prototype for a hackathon voting and team membership flow.

## What this includes

- Landing page with side-by-side project matchup (`Which project better?`)
- Mock auth gate + login page
- My page membership decision flow:
  - no membership → create or join
  - create project form
  - join project form with join-code validation
  - member view to edit project + see join code
- Voting flow that records votes, advances matchup pairs, and loops until all done
- Done page (`Thanks for voting!`)
- Local mocked state persisted in `localStorage`

## Route map

- `/` — Landing matchup preview + quick vote
- `/login` — Mock login
- `/my` — Membership decision + member project editor (auth-gated)
- `/my/create` — Create project (auth-gated)
- `/my/join` — Join by code (auth-gated)
- `/vote` — Main voting flow (auth-gated)
- `/done` — Completion page (auth-gated)

Existing utility routes still available:

- `/api/health`
- `/api/test-db`
- `/submit` (legacy placeholder)
- `/leaderboard` (legacy placeholder)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel readiness

This app is App Router based and deploys directly to Vercel with no extra config.

If you use `/api/test-db`, set:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Quick Access QR Code

Scan this QR code to quickly access the project page.

![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/hackathon-project)

**Note:** The QR code currently links to `https://example.com/hackathon-project`. Please replace `https://example.com/hackathon-project` in the Markdown with the actual deployed URL of your project.
