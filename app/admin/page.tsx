"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface HackathonStats {
  id: string;
  name: string;
  slug: string;
  projectCount: number;
  voteCount: number;
  participantCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<HackathonStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all hackathons
        const { data: hackathons, error: hackathonError } = await supabase
          .from("hackathons")
          .select("*")
          .order("created_at", { ascending: false });

        if (hackathonError) throw hackathonError;

        // Get project counts per hackathon
        const { data: projects } = await supabase
          .from("projects")
          .select("hackathon_id, created_by_user_id");

        // Get vote counts per hackathon
        const { data: votes } = await supabase
          .from("votes")
          .select("hackathon_id");

        const hackathonStats: HackathonStats[] = (hackathons || []).map((h) => {
          const projectCount = (projects as any[])?.filter(p => p.hackathon_id === h.id).length || 0;
          const voteCount = (votes as any[])?.filter(v => v.hackathon_id === h.id).length || 0;
          
          // Get unique participants for this hackathon
          const hackathonProjects = (projects as any[])?.filter(p => p.hackathon_id === h.id) || [];
          const participantCount = [...new Set(hackathonProjects.map(p => p.created_by_user_id))].length;

          return {
            id: h.id,
            name: h.name,
            slug: h.slug,
            projectCount,
            voteCount,
            participantCount,
          };
        });

        setStats(hackathonStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-4 text-slate-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back home
        </Link>
      </div>

      <div className="mt-8 grid gap-6">
        {stats.length === 0 ? (
          <div className="rounded-lg border border-slate-200 p-6 text-center">
            <p className="text-slate-600">No hackathons found.</p>
          </div>
        ) : (
          stats.map((hackathon) => (
            <div
              key={hackathon.id}
              className="rounded-lg border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{hackathon.name}</h2>
                  <p className="text-sm text-slate-500">/{hackathon.slug}</p>
                </div>
                <Link
                  href={`/${hackathon.slug}`}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200"
                >
                  View →
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {hackathon.projectCount}
                  </div>
                  <div className="text-sm text-blue-600">Projects</div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {hackathon.voteCount}
                  </div>
                  <div className="text-sm text-green-600">Votes</div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {hackathon.participantCount}
                  </div>
                  <div className="text-sm text-purple-600">Participants</div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <Link
                  href={`/leaderboard?hackathon=${hackathon.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Leaderboard
                </Link>
                <Link
                  href={`/${hackathon.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Hackathon Page
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}