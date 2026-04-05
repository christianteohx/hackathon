"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";

type RankedProject = {
  id: string;
  name: string;
  team_name: string | null;
  elo_rating: number;
};

export default function ResultsPage() {
  const [projects, setProjects] = useState<RankedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      const { data, error: queryError } = await (supabase as any)
        .from("projects")
        .select("id, name, team_name, elo_rating")
        .order("elo_rating", { ascending: false });

      if (queryError) {
        setError("Failed to load final rankings.");
      } else {
        setProjects((data || []) as RankedProject[]);
      }

      setLoading(false);
    };

    fetchRankings();
  }, []);

  const podium = useMemo(() => projects.slice(0, 3), [projects]);

  const handleShare = async () => {
    const topThree = podium
      .map((project, index) => `${index + 1}. ${project.name}`)
      .join("\n");
    const text = `🏆 Hackathon Results\n${topThree}\n\nSee full rankings: ${window.location.origin}/results`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Hackathon Results",
          text,
          url: `${window.location.origin}/results`,
        });
        setShareMessage("Shared successfully.");
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareMessage("Copied results to clipboard.");
    } catch {
      setShareMessage("Could not share right now. Try again.");
    }
  };

  return (
    <AppShell title="🏆 Final Results" subtitle="Voting is closed. Here are the final standings.">
      {loading ? (
        <p className="text-center text-[var(--muted-foreground)] py-12">Loading rankings...</p>
      ) : error ? (
        <div className="rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/5 p-4 text-sm text-[var(--error)]">
          {error}
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {podium.map((project, idx) => (
              <div
                key={project.id}
                className={`rounded-2xl border p-6 text-center shadow-sm ${
                  idx === 0
                    ? "medal-gold border-yellow-300 text-white"
                    : idx === 1
                      ? "medal-silver border-slate-300 text-slate-900"
                      : "medal-bronze border-orange-300 text-white"
                }`}
              >
                <div className="text-4xl mb-2">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div>
                <p className="text-xs uppercase tracking-wide opacity-80">{idx === 0 ? "Gold" : idx === 1 ? "Silver" : "Bronze"}</p>
                <h2 className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                  {project.name}
                </h2>
                {project.team_name && <p className="text-sm mt-1 opacity-90">{project.team_name}</p>}
                <p className="text-sm mt-3 font-semibold">{Math.round(project.elo_rating)} Elo</p>
              </div>
            ))}
          </div>

          {/* Full rankings */}
          <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden mb-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`flex items-center gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 ${
                  index < 3 ? "bg-[var(--muted)]/60" : "bg-white"
                }`}
              >
                <span className="w-8 text-center font-semibold text-[var(--muted-foreground)]">#{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--foreground)] truncate">{project.name}</p>
                  {project.team_name && <p className="text-xs text-[var(--muted-foreground)]">{project.team_name}</p>}
                </div>
                <span className="text-sm font-bold text-[var(--primary)]">{Math.round(project.elo_rating)} Elo</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              📣 Share Results
            </button>
            {shareMessage && <p className="text-sm text-[var(--muted-foreground)]">{shareMessage}</p>}
          </div>
        </>
      )}
    </AppShell>
  );
}
