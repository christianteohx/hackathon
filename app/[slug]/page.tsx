"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";

interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function HackathonPage({ params }: { params: { slug: string } }) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        .order("created_at", { ascending: true });

      if (projData) {
        // Map DB fields to Project type
        const rawProjData = projData as unknown as Record<string, unknown>[];
        const mapped: Project[] = rawProjData.map((p) => ({
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
          organizationId: '', // Will be empty for hackathon projects
        }));
        setProjects(mapped);
      }

      setLoading(false);
    };

    fetchData();
  }, [params.slug]);

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
              
              <div className="mt-4 flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(hackathon.start_date).toLocaleDateString()} – {new Date(hackathon.end_date).toLocaleDateString()}
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
