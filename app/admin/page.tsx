'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';

type HackerRow = {
  id: string;
  name: string;
  projectCount: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalVotes: 0,
    activeHackers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topProjects, setTopProjects] = useState<{ name: string; elo_rating: number; team_name: string | null }[]>([]);
  const [activeHackathonId, setActiveHackathonId] = useState<string | null>(null);
  const [announcementDraft, setAnnouncementDraft] = useState('');
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hackers'>('overview');
  const [hackers, setHackers] = useState<HackerRow[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const [projectsRes, votesRes, profilesRes, leaderboardRes, activeHackathonRes, hackersRes, projectOwnersRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('votes').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase
          .from('projects')
          .select('name, elo_rating, team_name')
          .order('elo_rating', { ascending: false })
          .limit(5),
        supabase
          .from('hackathons')
          .select('id, announcements')
          .eq('is_active', true)
          .order('start_date', { ascending: false })
          .limit(1)
          .maybeSingle(),
        (supabase as any)
          .from('profiles')
          .select('id, name, email')
          .order('name', { ascending: true }),
        supabase
          .from('projects')
          .select('created_by_user_id'),
      ]);

      if (projectsRes.error) console.error('projects error:', projectsRes.error);
      if (votesRes.error) console.error('votes error:', votesRes.error);
      if (profilesRes.error) console.error('profiles error:', profilesRes.error);
      if (leaderboardRes.error) console.error('leaderboard error:', leaderboardRes.error);
      if (activeHackathonRes.error) console.error('active hackathon error:', activeHackathonRes.error);
      if (hackersRes.error) console.error('hackers error:', hackersRes.error);
      if (projectOwnersRes.error) console.error('project owners error:', projectOwnersRes.error);

      setStats({
        totalProjects: projectsRes.count || 0,
        totalVotes: votesRes.count || 0,
        activeHackers: profilesRes.count || 0,
      });

      if (leaderboardRes.data) {
        setTopProjects(leaderboardRes.data);
      }

      if (hackersRes.data) {
        const projectCountByUser = new Map<string, number>();

        for (const project of projectOwnersRes.data || []) {
          const ownerId = (project as any).created_by_user_id as string | null;
          if (!ownerId) continue;
          projectCountByUser.set(ownerId, (projectCountByUser.get(ownerId) || 0) + 1);
        }

        const rows = (hackersRes.data as any[]).map((hacker) => ({
          id: hacker.id,
          name: hacker.name || hacker.email || 'Unknown hacker',
          projectCount: projectCountByUser.get(hacker.id) || 0,
        }));

        setHackers(rows);
      }

      const activeHackathon = activeHackathonRes.data as { id: string; announcements: string | null } | null;
      if (activeHackathon) {
        setActiveHackathonId(activeHackathon.id);
        setAnnouncementDraft(activeHackathon.announcements || '');
      }

      const hasError = projectsRes.error || votesRes.error || profilesRes.error;
      if (hasError) {
        setError('Some data could not be loaded. Showing partial results.');
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const saveAnnouncement = async () => {
    if (!activeHackathonId || savingAnnouncement) return;

    setSavingAnnouncement(true);
    setAnnouncementMessage(null);

    const { error: updateError } = await (supabase as any)
      .from('hackathons')
      .update({ announcements: announcementDraft.trim() || null })
      .eq('id', activeHackathonId);

    if (updateError) {
      setAnnouncementMessage('Failed to save announcement. Please try again.');
    } else {
      setAnnouncementMessage('Announcement saved.');
    }

    setSavingAnnouncement(false);
  };

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: '📁' },
    { label: 'Total Votes Cast', value: stats.totalVotes, icon: '🗳️' },
    { label: 'Active Hackers', value: stats.activeHackers, icon: '👥' },
  ];

  return (
    <AppShell title="🏁 Organizer Dashboard" subtitle="Overview of the current hackathon event">
      {loading && (
        <p className="text-center text-gray-500 py-12">Loading stats...</p>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      <div className="mb-6 inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hackers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'hackers' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Hackers
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="text-3xl mb-3">{icon}</div>
            <div className="text-4xl font-bold text-gray-900 leading-none">
              {loading ? '—' : value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-2">{label}</div>
          </div>
        ))}
      </div>

      {/* Top Projects */}
      {!loading && topProjects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🏆 Top Projects</h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {topProjects.map((project, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 ${
                  idx === 0 ? 'bg-yellow-50' : idx === 1 ? 'bg-slate-50' : idx === 2 ? 'bg-orange-50' : 'bg-white'
                }`}
              >
                <span className="w-8 text-center text-base">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                </span>
                <span className="flex-1 font-semibold text-gray-900 text-sm">{project.name}</span>
                {project.team_name && (
                  <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {project.team_name}
                  </span>
                )}
                <span className="font-bold text-blue-500 text-sm">{Math.round(project.elo_rating)} Elo</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcement */}
      {!loading && (
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">📣 Send Announcement</h2>
          <p className="text-sm text-gray-600 mb-4">
            This message appears as a dismissible banner at the top of the home page.
          </p>

          {activeHackathonId ? (
            <>
              <textarea
                value={announcementDraft}
                onChange={(e) => setAnnouncementDraft(e.target.value)}
                placeholder="Type an announcement for participants..."
                className="w-full min-h-28 rounded-lg border border-gray-300 p-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveAnnouncement}
                  disabled={savingAnnouncement}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingAnnouncement ? 'Sending...' : 'Send Announcement'}
                </button>
                {announcementMessage && (
                  <p className="text-sm text-gray-600">{announcementMessage}</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              No active hackathon found. Activate a hackathon to publish an announcement.
            </p>
          )}
        </div>
      )}

        </>
      ) : (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">👥 Hackers</h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-gray-200">
              <span>Name</span>
              <span>Projects</span>
            </div>
            {hackers.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">No participants found.</p>
            ) : (
              hackers.map((hacker) => (
                <div key={hacker.id} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-900">{hacker.name}</span>
                  <span className="text-sm font-semibold text-blue-600">{hacker.projectCount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/leaderboard"
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            📊 View Leaderboard
          </a>
          <a
            href="/vote"
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            🗳️ Start Voting
          </a>
          <a
            href="/submit"
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            ➕ Add Project
          </a>
          <a
            href="/stats"
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            📊 Event Stats
          </a>
          <a
            href="/results"
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            🏆 Final Results
          </a>
        </div>
      </div>
    </AppShell>
  );
}
