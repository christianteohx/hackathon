'use client';

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

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', pill: 'bg-yellow-100 text-yellow-800' };
    if (rank === 2) return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', pill: 'bg-slate-100 text-slate-700' };
    if (rank === 3) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', pill: 'bg-orange-100 text-orange-800' };
    return { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-700', pill: 'bg-gray-100 text-gray-600' };
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <AppShell title="🏆 Leaderboard" subtitle="Ranked by Elo rating — updated after every vote">
      {loading && (
        <p className="text-center text-gray-500 py-12">Loading leaderboard...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-xl font-semibold text-gray-700 mb-2">No projects yet</p>
          <p className="text-gray-500">
            <a href="/submit" className="text-blue-500 hover:text-blue-600">Submit the first project</a> to get voting started!
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7 md:col-span-6">Project</div>
            <div className="col-span-2 text-center hidden md:block">Rating</div>
            <div className="col-span-3 md:col-span-4 text-right">Links</div>
          </div>

          {projects.map((project, idx) => {
            const rank = idx + 1;
            const style = getRankStyle(rank);
            const medal = getMedalEmoji(rank);

            return (
              <div
                key={project.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50 ${style.bg}`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${medal ? style.text : 'text-gray-500 bg-gray-200'}`}>
                    {medal ? <span className="text-base">{medal}</span> : rank}
                  </div>
                </div>

                {/* Project Info */}
                <div className="col-span-8 md:col-span-6 min-w-0">
                  <div className="font-semibold text-gray-900 text-base">{project.name}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {project.team_name && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.pill}`}>
                        {project.team_name}
                      </span>
                    )}
                    {project.tagline && (
                      <span className="text-xs text-gray-500 truncate">{project.tagline}</span>
                    )}
                  </div>
                </div>

                {/* Elo Rating */}
                <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-blue-500 leading-none">{Math.round(project.elo_rating)}</span>
                  <span className="text-xs text-gray-400 mt-0.5">Elo</span>
                </div>

                {/* Mobile elo */}
                <div className="md:hidden col-span-3 flex flex-col items-end">
                  <span className="text-lg font-bold text-blue-500">{Math.round(project.elo_rating)}</span>
                  <span className="text-xs text-gray-400">Elo</span>
                </div>

                {/* Links */}
                <div className="col-span-3 md:col-span-4 flex gap-2 justify-end">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                    >
                      Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md bg-gray-800 text-white text-xs font-medium hover:bg-gray-900 transition-colors"
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
        <p className="mt-6 text-sm text-gray-500 text-center">
          {projects.length} project{projects.length !== 1 ? 's' : ''} · Leaderboard updates after every vote
        </p>
      )}
    </AppShell>
  );
}
