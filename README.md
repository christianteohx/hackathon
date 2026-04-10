# Hackathon Voting Platform

Next.js 14 App Router + TypeScript + Tailwind + Supabase platform for hackathon project submission, blind voting, AI judging, and event analytics.

## Features

### Voting System
- **Side-by-side voting** — Random project pairs, choose one or skip
- **Blind voting mode** — Hide team names for unbiased judging
- **Vote protection** — Track voted pairs to avoid duplicate votes
- **Leaderboard** — Real-time ranked project display with gold/silver/bronze styling

### Project Submission
- **Submit form** — Team name, project name, tagline, description, demo/GitHub links
- **Project detail pages** — Individual pages with QR codes and share links
- **Tag categories** — AI, Web, Mobile, etc.

### Admin / Organizer
- **Dashboard** — Stats overview (projects, votes, hackers)
- **Event Summary Generator** — AI-powered recap (winner, audience favorite, hidden gem)

### AI Features
- **Project pitch generator** — One-liner, audience, and judge-specific pitches
- **AI Judge** — Shark Tank and technical persona critics
- **Event summary** — Gemini 1.5 Flash via Vertex AI

### Tech & UX
- **Dark mode** — Full dark mode with system preference detection
- **Mobile responsive** — Works on all screen sizes
- **SEO** — robots.txt, sitemap.xml, Open Graph tags

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Postgres, Auth)
- **AI**: Google Vertex AI (gemini-1.5-flash)
- **Deployment**: Vercel

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local` from `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VERTEX_AI_PROJECT_ID=your_gcp_project_id  # optional — for AI features
```

## Supabase Setup

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full Supabase schema setup.

Required tables: `projects`, `votes`

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for:
- Vercel deployment steps
- Supabase project creation
- Environment variable configuration

## Secret scanning

This repo uses **gitleaks**:
- CI scan on every push/PR via `.github/workflows/gitleaks.yml`
- Optional local pre-commit hook in `.githooks/pre-commit`

Enable local hook once:

```bash
./scripts/setup-githooks.sh
```
