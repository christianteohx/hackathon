"use client";
import { useEffect, useState, useCallback } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";

interface SponsorLogo {
  name: string;
  logo_url: string;
}

interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  submission_deadline?: string | null;
  voting_deadline?: string | null;
  contact_email?: string | null;
  sponsor_logos?: SponsorLogo[] | null;
}

function DeadlineCountdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d > 0) setTimeLeft(`${d}d ${h}h left`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m left`);
      else setTimeLeft(`${m}m left`);
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  return <span>{timeLeft}</span>;
}

export default function OrgPage({ params }: { params: { slug: string } }) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const { data: hackData, error: hackError } = await supabase
      .from("hackathons")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (hackError || !hackData) {
      setLoading(false);
      return;
    }

    const hack = hackData as Hackathon;
    setHackathon(hack);

    const { data: projData } = await supabase
      .from("projects")
      .select("*")
      .eq("hackathon_id", hack.id)
      .order("created_at", { ascending: true });

    if (projData) {
      const mapped: Project[] = (projData as unknown as Record<string, unknown>[]).map((p) => ({
        id: p.id as string,
        name: p.name as string,
        summary: (p.description || p.summary) as string,
        tagline: p.tagline as string | undefined,
        owner: (p.team_name || p.owner) as string | undefined,
        joinCode: p.join_code as string,
        demo_url: p.demo_url as string | null,
        github_url: p.github_url as string | null,
        elo_rating: p.elo_rating as number | undefined,
        created_at: p.created_at as string | undefined,
        tags: [],
        organizationId: '',
      }));
      setProjects(mapped);
    }

    setLoading(false);
  }, [params.slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading hackathon...</p>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    notFound();
  }

  // Determine which deadline to show
  const effectiveDeadline = hackathon.voting_deadline || hackathon.end_date;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto w-full px-6 py-16">
          {/* Back nav */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All hackathons
          </Link>

          {/* Hackathon info */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              {/* Status badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                Active Hackathon
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {hackathon.name}
              </h1>

              {hackathon.description && (
                <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl">
                  {hackathon.description}
                </p>
              )}

              {/* Deadline countdown */}
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {effectiveDeadline && (
                    <span className="font-semibold text-[var(--primary)]">
                      <DeadlineCountdown deadline={effectiveDeadline} />
                    </span>
                  )}
                  {!effectiveDeadline && (
                    <span>
                      {new Date(hackathon.start_date).toLocaleDateString()} – {new Date(hackathon.end_date).toLocaleDateString()}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/vote?hackathon=${hackathon.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity glow-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Voting
              </Link>
              <Link
                href={`/leaderboard?hackathon=${hackathon.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--muted)] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <section className="flex-1 py-12">
        <div className="max-w-5xl mx-auto w-full px-6">
          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2
                className="text-2xl font-bold text-[var(--foreground)] tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Projects
              </h2>
              <p className="mt-1 text-[var(--muted-foreground)]">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} submitted
              </p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--border)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-[var(--foreground)] mb-2">No projects yet</p>
              <p className="text-[var(--muted-foreground)]">Be the first to submit a project!</p>
              <Link
                href="/submit"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Submit a Project
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`animate-fade-in-up stagger-${Math.min(idx + 1, 5)}`}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sponsor Logos Section */}
      <section className="border-t border-[var(--border)] py-12 bg-[var(--muted)]/30">
        <div className="max-w-5xl mx-auto w-full px-6">
          <h2
            className="text-xl font-bold text-[var(--foreground)] tracking-tight text-center mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Our Sponsors
          </h2>
          {hackathon.sponsor_logos && hackathon.sponsor_logos.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {hackathon.sponsor_logos.map((sponsor, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {sponsor.logo_url ? (
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="h-10 px-4 flex items-center justify-center rounded-lg bg-white border border-[var(--border)] text-sm font-semibold text-[var(--muted-foreground)]">
                      {sponsor.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
              {/* Placeholder sponsor logos */}
              {['TechCorp', 'CloudBase', 'DevTools Inc', 'StackHub', 'CodeFlow'].map((name) => (
                <div
                  key={name}
                  className="h-10 px-4 flex items-center justify-center rounded-lg bg-white border border-[var(--border)] text-sm font-semibold text-[var(--muted-foreground)]"
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          >
            ← Back to all hackathons
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-semibold text-[var(--primary)] hover:opacity-80 transition-opacity"
          >
            View leaderboards →
          </Link>
        </div>
      </footer>
    </main>
  );
}
