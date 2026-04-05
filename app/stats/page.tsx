"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";

type StatsState = {
  totalProjects: number;
  totalVotes: number;
  totalVoters: number;
  topProject: string;
  topProjectElo: number | null;
  votingDeadline: Date | null;
};

const EMPTY_STATE: StatsState = {
  totalProjects: 0,
  totalVotes: 0,
  totalVoters: 0,
  topProject: "—",
  topProjectElo: null,
  votingDeadline: null,
};

export default function StatsPage() {
  const [stats, setStats] = useState<StatsState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      const [projectsRes, votesRes, topProjectRes, activeHackathonRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("votes").select("session_id", { count: "exact" }),
        (supabase as any).from("projects").select("name, elo_rating").order("elo_rating", { ascending: false }).limit(1).maybeSingle(),
        (supabase as any)
          .from("hackathons")
          .select("voting_deadline")
          .eq("is_active", true)
          .order("start_date", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      const voterSet = new Set<string>();
      (votesRes.data || []).forEach((row: { session_id: string | null }) => {
        if (row.session_id) voterSet.add(row.session_id);
      });

      setStats({
        totalProjects: projectsRes.count || 0,
        totalVotes: votesRes.count || 0,
        totalVoters: voterSet.size,
        topProject: topProjectRes.data?.name || "—",
        topProjectElo: topProjectRes.data?.elo_rating || null,
        votingDeadline: activeHackathonRes.data?.voting_deadline ? new Date(activeHackathonRes.data.voting_deadline) : null,
      });
      setLastUpdated(new Date());
      setLoading(false);
    };

    loadStats();
    const timer = setInterval(loadStats, 10000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const timeRemaining = useMemo(() => {
    if (!stats.votingDeadline) return "No deadline set";
    const diff = stats.votingDeadline.getTime() - Date.now();
    if (diff <= 0) return "Voting closed";

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    return `${hours}h ${mins}m`;
  }, [stats.votingDeadline, lastUpdated]);

  const cards = [
    { label: "Total Projects", value: stats.totalProjects.toLocaleString(), icon: "📁" },
    { label: "Total Votes", value: stats.totalVotes.toLocaleString(), icon: "🗳️" },
    { label: "Total Voters", value: stats.totalVoters.toLocaleString(), icon: "👥" },
    { label: "Time Remaining", value: timeRemaining, icon: "⏳" },
    {
      label: "Top Project",
      value:
        stats.topProject === "—"
          ? "—"
          : `${stats.topProject}${stats.topProjectElo ? ` (${Math.round(stats.topProjectElo)} Elo)` : ""}`,
      icon: "🏆",
    },
  ];

  return (
    <AppShell title="📊 Event Stats" subtitle="Live projector-ready hackathon metrics (auto-refreshes every 10 seconds)">
      {loading ? (
        <p className="text-center py-16 text-[var(--muted-foreground)]">Loading live stats...</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <p className="text-3xl mb-3">{card.icon}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{card.label}</p>
                <p className="mt-1 text-2xl md:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-[var(--muted-foreground)] text-center">
            Last updated {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
          </p>
        </>
      )}
    </AppShell>
  );
}
