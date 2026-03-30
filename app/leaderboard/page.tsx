"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';

type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  team_name: string | null;
  demo_url: string | null;
  github_url: string | null;
  elo_rating: number;
  join_code: string;
};

export default function LeaderboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('id, name, tagline, description, team_name, demo_url, github_url, elo_rating, join_code')
        .order('elo_rating', { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error('Error fetching leaderboard:', fetchError);
        setError('Could not load leaderboard. Please try again.');
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getMedalStyle = (rank: number) => {
    if (rank === 1) return { 
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', 
      border: 'border-amber-200', 
      medal: 'medal-gold',
      text: 'text-amber-700'
    };
    if (rank === 2) return { 
      bg: 'bg-gradient-to-br from-slate-50 to-gray-50', 
      border: 'border-slate-200', 
      medal: 'medal-silver',
      text: 'text-slate-600'
    };
    if (rank === 3) return { 
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50', 
      border: 'border-orange-200', 
      medal: 'medal-bronze',
      text: 'text-orange-700'
    };
    return { 
      bg: 'bg-white', 
      border: 'border-[var(--border)]', 
      medal: '',
      text: 'text-[var(--foreground)]'
    };
  };

  const top3 = projects.slice(0, 3);
  const rest = projects.slice(3);

  return (
    <AppShell 
      title="🏆 Leaderboard" 
      subtitle="Ranked by Elo rating — updated after every vote"
    >
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[var(--muted-foreground)]">Loading rankings...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-[var(--error)]/20 bg-[var(--error)]/5 p-4 text-[var(--error)] text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--border)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-[var(--foreground)] mb-2">No projects yet</p>
          <p className="text-[var(--muted-foreground)]">
            <a href="/submit" className="text-[var(--primary)] hover:opacity-80">Submit the first project</a> to get voting started!
          </p>
        </div>
      )}

      {/* Top 3 Podium */}
      {!loading && !error && top3.length > 0 && (
        <div className="mb-8">
          {/* Podium cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 2nd place */}
            {top3[1] && (
              <div className={`rounded-xl border ${getMedalStyle(2).border} ${getMedalStyle(2).bg} p-5 card-hover`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${getMedalStyle(2).medal} flex items-center justify-center text-white font-bold text-sm`}>
                    2
                  </div>
                  <span className="text-sm font-semibold text-[var(--muted-foreground)]">2nd Place</span>
                </div>
                <h3 
                  className="text-lg font-bold text-[var(--foreground)] truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {top3[1].name}
                </h3>
                {top3[1].team_name && (
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{top3[1].team_name}</p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--primary)]">{Math.round(top3[1].elo_rating)}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">Elo</span>
                </div>
              </div>
            )}
            
            {/* 1st place */}
            {top3[0] && (
              <div className={`rounded-xl border ${getMedalStyle(1).border} ${getMedalStyle(1).bg} p-6 card-hover md:-mt-4 md:mb-[-1rem]`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full ${getMedalStyle(1).medal} flex items-center justify-center text-white font-bold text-base`}>
                    ★
                  </div>
                  <span className="text-sm font-semibold text-[var(--muted-foreground)]">1st Place</span>
                </div>
                <h3 
                  className="text-xl font-bold text-[var(--foreground)] truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {top3[0].name}
                </h3>
                {top3[0].team_name && (
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{top3[0].team_name}</p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--primary)]">{Math.round(top3[0].elo_rating)}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">Elo</span>
                </div>
              </div>
            )}
            
            {/* 3rd place */}
            {top3[2] && (
              <div className={`rounded-xl border ${getMedalStyle(3).border} ${getMedalStyle(3).bg} p-5 card-hover`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${getMedalStyle(3).medal} flex items-center justify-center text-white font-bold text-sm`}>
                    3
                  </div>
                  <span className="text-sm font-semibold text-[var(--muted-foreground)]">3rd Place</span>
                </div>
                <h3 
                  className="text-lg font-bold text-[var(--foreground)] truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {top3[2].name}
                </h3>
                {top3[2].team_name && (
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{top3[2].team_name}</p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--primary)]">{Math.round(top3[2].elo_rating)}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">Elo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rest of the rankings */}
      {!loading && !error && rest.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7 md:col-span-6">Project</div>
            <div className="col-span-2 text-center hidden md:block">Rating</div>
            <div className="col-span-3 md:col-span-4 text-right">Links</div>
          </div>

          {rest.map((project, idx) => {
            const rank = idx + 4;
            const style = getMedalStyle(rank);

            return (
              <div
                key={project.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--muted)]/50 ${style.bg}`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-[var(--muted)] text-[var(--muted-foreground)]">
                    {rank}
                  </div>
                </div>

                {/* Project Info */}
                <div className="col-span-8 md:col-span-6 min-w-0">
                  <div 
                    className="font-semibold text-[var(--foreground)] text-base truncate"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {project.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {project.team_name && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[var(--muted)] text-[var(--muted-foreground)]">
                        {project.team_name}
                      </span>
                    )}
                    {project.tagline && (
                      <span className="text-xs text-[var(--muted-foreground)] truncate">{project.tagline}</span>
                    )}
                  </div>
                </div>

                {/* Elo Rating */}
                <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--primary)] leading-none">{Math.round(project.elo_rating)}</span>
                  <span className="text-xs text-[var(--muted-foreground)] mt-0.5">Elo</span>
                </div>

                {/* Mobile elo */}
                <div className="md:hidden col-span-3 flex flex-col items-end">
                  <span className="text-lg font-bold text-[var(--primary)]">{Math.round(project.elo_rating)}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">Elo</span>
                </div>

                {/* Links */}
                <div className="col-span-3 md:col-span-4 flex gap-2 justify-end">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <p className="mt-6 text-sm text-[var(--muted-foreground)] text-center">
          {projects.length} project{projects.length !== 1 ? 's' : ''} ranked · Leaderboard updates after every vote
        </p>
      )}
    </AppShell>
  );
}
