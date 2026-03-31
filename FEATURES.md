# Hackathon Platform — New Feature Suggestions

## Priority 1: Judging Panel (`/judge`)

**What:** A dedicated judging interface where judges can:
- Browse all submitted projects
- Score each project on criteria: Innovation (1-10), Technical (1-10), Presentation (1-10), Impact (1-10)
- See an overall weighted score
- Leave written feedback/verdict per project

**Why it matters:** Without a judge interface, the AI judge is the only feedback mechanism. Real hackathons need judges to score.

**Effort:** Medium

**Files to create:**
- `app/judge/page.tsx` — Judge dashboard with project list and scoring cards
- `app/judge/[id]/page.tsx` — Individual project scoring form
- Add to SiteNav as "Judges" link

**Supabase table:**
- `judge_scores`: id, project_id, judge_name, innovation, technical, presentation, impact, feedback, created_at

---

## Priority 2: Leaderboard Search & Filter

**What:**
- Search bar on `/leaderboard` to filter projects by name
- Filter by tag/technology
- Sort by: Elo (default), Most Votes, Newest

**Why it matters:** As projects grow, the leaderboard becomes hard to navigate.

**Effort:** Small

---

## Priority 3: Voting Progress Indicator

**What:**
- On `/vote`, show "You've voted X times this session"  
- Show total votes cast globally ("127 votes cast so far")

**Why it matters:** Creates engagement and social proof.

**Effort:** Small

---

## Priority 4: Short Description in Vote Cards

**What:** Show 1-2 lines of the project description below the tagline on vote cards.

**Why it matters:** Voters see more signal, not just a name.

**Effort:** Small — update `VoteDuel` component.

---

## Priority 5: Project Countdown Timer

**What:**
- A countdown on `/` and `/vote` showing time until voting ends
- Configurable deadline in Supabase `hackathons` table

**Why it matters:** Creates urgency and event energy.

**Effort:** Small
