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

- [ ] App shell layout
- [ ] Navigation bar
- [ ] Links:
  - [ ] Home
  - [ ] Submit
  - [ ] Vote
  - [ ] Leaderboard

---

## Project Submission

Page: `/submit`

- [ ] Submission form UI
- [ ] Form fields:
  - [ ] team name
  - [x] project name
  - [x] tagline
  - [x] description
  - [ ] demo URL (optional)
  - [ ] github URL (optional)
- [ ] Form validation
- [ ] Save project to Supabase
- [ ] Redirect to project page after submission

---

## Database

### Table: `projects`

Fields

- [ ] id
- [ ] team_name
- [ ] project_name
- [x] tagline
- [x] description
- [ ] demo_url
- [ ] github_url
- [ ] created_at

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

- [ ] Fetch two random projects
- [ ] Display project cards
- [ ] Show:
  - [x] project name
  - [x] tagline
  - [ ] short description
- [ ] Vote buttons
- [ ] Store vote result
- [ ] Load next pair after vote

---

## Leaderboard

Page: `/leaderboard`

- [ ] Fetch projects
- [ ] Aggregate vote counts
- [ ] Rank projects
- [ ] Display ranking table

Columns:

- [ ] Rank
- [ ] Project Name
- [ ] Team
- [ ] Vote Score

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

- [ ] Total projects
- [ ] Total votes
- [ ] Current leaderboard
- [ ] Top projects

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

- [ ] Persona: Shark Tank judge
- [ ] Persona: Technical judge

Output:

- [ ] score
- [ ] verdict
- [ ] strengths
- [ ] concerns

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
