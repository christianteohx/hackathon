"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default function HomePage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: false });

      if (!error && data) {
        setHackathons(data);
      }
      setLoading(false);
    };

    fetchHackathons();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Hackathon Voting</h1>
        <p className="mt-2 text-slate-600">Select a hackathon to get started</p>
      </div>

      {hackathons.length === 0 ? (
        <div className="rounded-lg border border-slate-200 p-6 text-center">
          <p className="text-slate-600">No active hackathons found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {hackathons.map((hackathon) => (
            <Link
              key={hackathon.id}
              href={`/${hackathon.slug}`}
              className="block rounded-lg border border-slate-200 p-6 transition hover:border-slate-300 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{hackathon.name}</h2>
              {hackathon.description && (
                <p className="mt-1 text-sm text-slate-600">{hackathon.description}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-auto pt-8 text-center">
        <Link href="/leaderboard" className="text-sm text-slate-600 hover:underline">
          View all leaderboards →
        </Link>
      </div>
    </main>
  );
}