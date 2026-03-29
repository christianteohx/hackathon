# Hackathon Voting Platform – Build Checklist

Goal: Deploy a working platform where teams can submit projects, users vote between projects, and a leaderboard updates live.

---

# Phase 0 – Project Setup

- [x] Create Next.js project (App Router + TypeScript)
- [ ] Connect GitHub repository
- [ ] Deploy base project to Vercel
- [ ] Create Supabase project
- [ ] Add environment variables
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Create Supabase client (`/lib/supabase.ts`)
- [ ] Confirm frontend renders on deployed URL

---

# Phase 1 – Core Product (MVP)

## Navigation / Layout

- [x] App shell layout
- [x] Navigation bar (with active state highlighting)
- [x] Links:
  - [x] Home
  - [x] Submit
  - [x] Vote
  - [x] Leaderboard

---

## Project Submission

Page: `/submit`

- [x] Submission form UI
- [x] Form fields:
  - [x] team name
  - [x] project name
  - [x] tagline
  - [x] description
  - [x] demo URL (optional)
  - [x] github URL (optional)
- [x] Form validation
- [x] Save project to Supabase (with join_code, elo_rating, hackathon_id)
- [x] Redirect to project page after submission

---

## Database

### Table: `projects`

Fields

- [x] id (auto)
- [x] team_name
- [x] project_name
- [x] tagline
- [x] description
- [x] demo_url
- [x] github_url
- [x] created_at

### Table: `votes`

Fields

- [ ] id
- [ ] left_project_id
- [ ] right_project_id
- [ ] winner_project_id
- [ ] created_at
- [ ] session_id (optional)

---

## Voting System

Page: `/vote`

- [x] Fetch two random projects
- [x] Display project cards
- [x] Show:
  - [x] project name
  - [x] tagline
  - [ ] short description
- [x] Vote buttons
- [x] Store vote result
- [x] Load next pair after vote

---

## Leaderboard

Page: `/leaderboard`

- [x] Fetch projects from Supabase
- [x] Aggregate vote counts
- [x] Rank projects by elo_rating
- [x] Display ranking table

Columns:

- [x] Rank
- [x] Project Name
- [x] Team
- [x] Vote Score (Elo rating)

---

# Phase 2 – Core Enhancements

## Project Page

Route: `/project/[id]`

- [ ] Project detail page
- [ ] Full description
- [ ] Demo link
- [ ] GitHub link
- [ ] Vote count

---

## Organizer Dashboard

Page: `/admin`

- [x] Total projects (from Supabase)
- [x] Total votes (from Supabase)
- [x] Active hackers count (from Supabase profiles)
- [x] Top 5 projects by Elo

---

## Vote Protection

- [ ] Session ID tracking
- [ ] Prevent duplicate pair voting
- [ ] Rate limit votes

---

# Phase 3 – AI Features (Vertex AI)

## AI Pitch Generator

- [x] Input:
  - [x] project name
  - [x] tagline
  - [x] description

- [x] Output:
  - [x] one-line pitch
  - [x] audience pitch
  - [x] judge pitch

- [x] Display on project page

---

## AI Judge

- [x] Persona: Shark Tank judge
- [x] Persona: Technical judge

Output:

- [x] score
- [x] verdict
- [x] strengths
- [x] concerns

---

## Event Summary Generator

Generate:

- [ ] winner
- [ ] audience favorite
- [ ] hidden gem
- [ ] recap paragraph

---

# Final Demo Checklist

- [ ] App deployed on Vercel
- [ ] Projects can be submitted
- [ ] Voting works
- [ ] Leaderboard updates
- [ ] At least one AI feature works

---

# Stretch Features (Only If Time Remains)

- [ ] Blind voting mode
- [ ] QR code links for projects
- [ ] Project tags
- [ ] Trending projects page
- [ ] Shareable project links
