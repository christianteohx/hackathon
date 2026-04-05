"use client";

import { useEffect, useState, useRef } from 'react';
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
  tags?: string[];
  created_at?: string;
};

function formatRelativeDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export default function LeaderboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'elo' | 'trending'>('elo');
  const [judgeScores, setJudgeScores] = useState<Record<string, number>>({});
  const [newProjectIds, setNewProjectIds] = useState<Set<string>>(new Set());
  const prevProjectsRef = useRef<string[]>([]);

  // Extract all unique tags from projects
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags ?? []))
  ).sort();

  // Fetch judge scores for all projects
  const fetchJudgeScores = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('judge_scores')
        .select('project_id, innovation, technical, presentation, impact');
      if (error) return;
      // Average score per project (avg of all 4 dimensions)
      const scores: Record<string, number[]> = {};
      (data || []).forEach((s: { project_id: string; innovation: number; technical: number; presentation: number; impact: number }) => {
        const avg = (s.innovation + s.technical + s.presentation + s.impact) / 4;
        if (!scores[s.project_id]) scores[s.project_id] = [];
        scores[s.project_id].push(avg);
      });
      const avgScores: Record<string, number> = {};
      Object.entries(scores).forEach(([id, arr]) => {
        avgScores[id] = arr.reduce((a, b) => a + b, 0) / arr.length;
      });
      setJudgeScores(avgScores);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchJudgeScores();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      const [projectsRes, votesRes, judgeScoresRes] = await Promise.all([
        supabase
          .from('projects')
          .select('id, name, tagline, description, team_name, demo_url, github_url, elo_rating, join_code, tags, created_at')
          .limit(50),
        supabase
          .from('votes')
          .select('winner_project_id'),
        (supabase as any)
          .from('judge_scores')
          .select('project_id, innovation, technical, presentation, impact'),
      ]);

      if (projectsRes.error) {
        console.error('Error fetching leaderboard:', projectsRes.error);
        setError('Could not load leaderboard. Please try again.');
        setLoading(false);
        return;
      }

      const voteCounts: Record<string, number> = {};
      (votesRes.data || []).forEach((vote: { winner_project_id: string }) => {
        voteCounts[vote.winner_project_id] = (voteCounts[vote.winner_project_id] || 0) + 1;
      });

      const judgeAverages: Record<string, number> = {};
      const judgeBuckets: Record<string, number[]> = {};
      (judgeScoresRes.data || []).forEach((s: { project_id: string; innovation: number; technical: number; presentation: number; impact: number }) => {
        const avg = (s.innovation + s.technical + s.presentation + s.impact) / 4;
        if (!judgeBuckets[s.project_id]) judgeBuckets[s.project_id] = [];
        judgeBuckets[s.project_id].push(avg);
      });
      Object.entries(judgeBuckets).forEach(([projectId, arr]) => {
        judgeAverages[projectId] = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      });

      const parsed = (projectsRes.data || []).map((p: Record<string, unknown>) => {
        const id = p.id as string;
        const avgJudge = Number.isFinite(judgeAverages[id]) ? judgeAverages[id] : 0;
        const voteCount = voteCounts[id] || 0;
        const combinedScore = avgJudge + voteCount;
        return {
          ...p,
          tags: p.tags ? (p.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
          elo_rating: Number.isFinite(combinedScore) ? combinedScore : 0,
        };
      });

      parsed.sort((a: any, b: any) => (b.elo_rating ?? 0) - (a.elo_rating ?? 0));
      setProjects(parsed as Project[]);
      setLoading(false);
    };

    fetchLeaderboard();

    const fetchTrending = async () => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Get vote counts per project (as winner) in the last 24 hours
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('winner_project_id, created_at')
        .gte('created_at', twentyFourHoursAgo);

      if (votesError) {
        console.error('Error fetching trending votes:', votesError);
        return;
      }

      // Count votes per project
      const voteCounts: Record<string, number> = {};
      (votesData || []).forEach((vote: { winner_project_id: string }) => {
        voteCounts[vote.winner_project_id] = (voteCounts[vote.winner_project_id] || 0) + 1;
      });

      // Get project ids sorted by vote count
      const sortedIds = Object.entries(voteCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => id);

      if (sortedIds.length === 0) {
        setTrendingProjects([]);
        return;
      }

      // Fetch full project data for trending projects
      const { data: trendingData } = await supabase
        .from('projects')
        .select('id, name, tagline, description, team_name, demo_url, github_url, elo_rating, join_code, tags, created_at')
        .in('id', sortedIds);

      // Sort by vote count order and parse tags
      if (trendingData) {
        const parsed = (trendingData as Record<string, unknown>[]).map((p) => ({
          ...p,
          tags: p.tags ? (p.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        }));
        const sorted = sortedIds
          .map(id => parsed.find((p: Record<string, unknown>) => p.id === id))
          .filter(Boolean) as Project[];
        setTrendingProjects(sorted);
      }
    };

    fetchTrending();
    // Poll for leaderboard updates every 30s
    const poll = setInterval(() => {
      fetchLeaderboard();
      fetchTrending();
      fetchJudgeScores();
    }, 30000);
    return () => clearInterval(poll);
  }, []);

  // Track which project IDs are new since last render (for row animation)
  useEffect(() => {
    const currentIds = projects.map((p) => p.id);
    const newIds = new Set(currentIds.filter((id) => !prevProjectsRef.current.includes(id)));
    if (newIds.size > 0) {
      setNewProjectIds(newIds);
      // Clear the "new" flag after animation completes
      const timer = setTimeout(() => setNewProjectIds(new Set()), 800);
      return () => clearTimeout(timer);
    }
    prevProjectsRef.current = currentIds;
  }, [projects]);

  // Filter projects by search query and selected tag
  useEffect(() => {
    const sourceProjects = activeTab === 'trending' ? trendingProjects : projects;
    let result = sourceProjects;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.team_name && p.team_name.toLowerCase().includes(q))
      );
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags && p.tags.includes(selectedTag));
    }

    setFilteredProjects(result);
  }, [projects, trendingProjects, searchQuery, selectedTag, activeTab]);

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

  const top3 = filteredProjects.slice(0, 3);
  const rest = filteredProjects.slice(3);

  return (
    <AppShell
      title="🏆 Leaderboard"
      subtitle={activeTab === 'elo' ? 'Ranked by combined score (avg judge score + vote count)' : 'Ranked by votes in the last 24 hours'}
    >
      <div className="leaderboard-print-root">
      {/* Tab Switcher */}
      <div className="mb-6 flex flex-wrap items-center gap-2 print:hidden">
        <button
          onClick={() => setActiveTab('elo')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'elo'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
          }`}
        >
          🏅 Overall
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'trending'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
          }`}
        >
          📈 Trending
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-white text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
          </svg>
          Print Rankings
        </button>
      </div>

      {/* Search & Filter Bar */}
      {!loading && !error && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3 print:hidden">
          {/* Search input */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects by name or team name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer min-w-[140px]"
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-16 text-center animate-fade-in-up">
          {/* Illustration */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--muted)] flex items-center justify-center">
            <span className="text-5xl" role="img" aria-label="Trophy">🏆</span>
          </div>
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            No projects yet
          </h3>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
            Be the first to submit your project and kick off the competition!
          </p>
          <a
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit the First Project
          </a>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {/* Skeleton: tab switcher */}
          <div className="flex gap-2">
            <div className="h-10 w-32 rounded-lg skeleton" />
            <div className="h-10 w-32 rounded-lg skeleton" />
          </div>
          {/* Skeleton: search */}
          <div className="h-12 rounded-xl skeleton" />
          {/* Skeleton: podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-48 rounded-xl skeleton" />
            <div className="h-56 rounded-xl skeleton md:-mt-4" />
            <div className="h-48 rounded-xl skeleton" />
          </div>
          {/* Skeleton: list rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)]">
              <div className="w-9 h-9 rounded-full skeleton flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-5 w-48 rounded skeleton mb-2" />
                <div className="h-4 w-32 rounded skeleton" />
              </div>
              <div className="h-8 w-16 rounded skeleton flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-[var(--error)]/20 bg-[var(--error)]/5 p-8 text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--error)]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Something went wrong
          </h3>
          <p className="text-[var(--muted-foreground)] mb-6">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredProjects.length === 0 && projects.length > 0 && (searchQuery || selectedTag) && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--border)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-[var(--foreground)] mb-2">No results found</p>
          <p className="text-[var(--muted-foreground)]">
            Try a different search term or{' '}
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag(''); }}
              className="text-[var(--primary)] hover:opacity-80"
            >
              clear the filters
            </button>
          </p>
        </div>
      )}

      {/* Top 3 Podium */}
      {!loading && !error && top3.length > 0 && (
        <div className="mb-8 print:hidden">
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
                  {judgeScores[top3[1].id] != null && (
                    <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
                      ★ {judgeScores[top3[1].id].toFixed(1)}
                    </span>
                  )}
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
                {top3[1].created_at && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Submitted {formatRelativeDate(top3[1].created_at)}</p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--primary)]">{Math.round(top3[1].elo_rating)}</span>
                  <span className="tooltip-wrapper">
                    <span className="text-sm text-[var(--muted-foreground)]">Elo</span>
                    <span className="tooltip-content">Elo rating — higher = more votes</span>
                  </span>
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
                  {judgeScores[top3[0].id] != null && (
                    <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
                      ★ {judgeScores[top3[0].id].toFixed(1)}
                    </span>
                  )}
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
                {top3[0].created_at && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Submitted {formatRelativeDate(top3[0].created_at)}</p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--primary)]">{Math.round(top3[0].elo_rating)}</span>
                  <span className="tooltip-wrapper">
                    <span className="text-sm text-[var(--muted-foreground)]">Elo</span>
                    <span className="tooltip-content">Elo rating — higher = more votes</span>
                  </span>
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
                  {judgeScores[top3[2].id] != null && (
                    <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
                      ★ {judgeScores[top3[2].id].toFixed(1)}
                    </span>
                  )}
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
                {top3[2].created_at && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Submitted {formatRelativeDate(top3[2].created_at)}</p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--primary)]">{Math.round(top3[2].elo_rating)}</span>
                  <span className="tooltip-wrapper">
                    <span className="text-sm text-[var(--muted-foreground)]">Elo</span>
                    <span className="tooltip-content">Elo rating — higher = more votes</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rest of the rankings */}
      {!loading && !error && rest.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white shadow-sm print:hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7 md:col-span-5">Project</div>
            <div className="col-span-2 text-center hidden md:block">Rating</div>
            <div className="col-span-4 md:col-span-4 text-right hidden md:block">Links</div>
          </div>

          {rest.map((project, idx) => {
            const rank = idx + 4;
            const style = getMedalStyle(rank);
            const avgScore = judgeScores[project.id];
            const isNew = newProjectIds.has(project.id);

            return (
              <div
                key={project.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--muted)]/50 ${style.bg} ${isNew ? 'animate-row-shift' : ''}`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-[var(--muted)] text-[var(--muted-foreground)]">
                    {rank}
                  </div>
                </div>

                {/* Project Info */}
                <div className="col-span-8 md:col-span-5 min-w-0">
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
                    {avgScore != null && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
                        ★ {avgScore.toFixed(1)}
                      </span>
                    )}
                    {project.tagline && (
                      <span className="text-xs text-[var(--muted-foreground)] truncate">{project.tagline}</span>
                    )}
                  </div>
                  {project.created_at && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Submitted {formatRelativeDate(project.created_at)}
                    </p>
                  )}
                </div>

                {/* Elo Rating */}
                <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--primary)] leading-none">{Math.round(project.elo_rating)}</span>
                  <span className="tooltip-wrapper">
                    <span className="text-xs text-[var(--muted-foreground)] mt-0.5">Elo</span>
                    <span className="tooltip-content">Elo rating — higher = more votes</span>
                  </span>
                </div>

                {/* Mobile elo + links */}
                <div className="md:hidden col-span-3 flex flex-col items-end gap-1">
                  <span className="text-lg font-bold text-[var(--primary)]">{Math.round(project.elo_rating)}</span>
                  <div className="flex gap-1">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-[var(--primary)] text-white text-xs font-semibold">Demo</a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold">GitHub</a>
                    )}
                  </div>
                </div>

                {/* Desktop links */}
                <div className="hidden md:flex col-span-4 gap-2 justify-end items-center">
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


      {!loading && !error && filteredProjects.length > 0 && (
        <div className="leaderboard-print-only hidden print:block mt-2">
          <div className="rounded-xl border border-[var(--border)] overflow-hidden print:rounded-none print:border-0">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-[var(--muted)] text-xs font-semibold uppercase tracking-wide">
              <div className="col-span-2">Rank</div>
              <div className="col-span-6">Project</div>
              <div className="col-span-2 text-center">Rating</div>
              <div className="col-span-2 text-right">Judge</div>
            </div>
            {filteredProjects.map((project, idx) => {
              const avgScore = judgeScores[project.id];
              return (
                <div key={`print-${project.id}`} className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-[var(--border)] text-sm">
                  <div className="col-span-2 font-semibold">#{idx + 1}</div>
                  <div className="col-span-6 min-w-0">
                    <p className="font-semibold truncate">{project.name}</p>
                    {project.team_name && <p className="text-xs text-[var(--muted-foreground)]">{project.team_name}</p>}
                  </div>
                  <div className="col-span-2 text-center font-semibold">{Math.round(project.elo_rating)}</div>
                  <div className="col-span-2 text-right">{avgScore != null ? avgScore.toFixed(1) : '—'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <p className="mt-6 text-sm text-[var(--muted-foreground)] text-center print:hidden">
          {filteredProjects.length === projects.length
            ? `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} ranked`
            : `${filteredProjects.length} of ${projects.length} projects`}
          {' · '}Leaderboard updates after every vote
          {(searchQuery || selectedTag) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag(''); }}
              className="ml-2 text-[var(--primary)] hover:opacity-80 underline"
            >
              Clear filters
            </button>
          )}
        </p>
      )}
      </div>
    </AppShell>
  );
}
