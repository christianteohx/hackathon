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
    <main className="w-full min-h-screen flex flex-col gap-8 p-8 bg-white">
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-inner text-center">
        <h1 className="text-5xl font-extrabold text-purple-700 tracking-tight leading-tight">Hackathon Voting Platform</h1>
        <p className="mt-4 text-lg text-gray-700 max-w-md">Discover, explore, and vote on innovative projects from the brightest minds.</p>
      </div>

      <h2 className="text-3xl font-extrabold text-purple-700 text-center mt-12 mb-8">Active Hackathons</h2>

      {hackathons.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center shadow-md">
          <p className="text-lg text-gray-600">No active hackathons found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {hackathons.map((hackathon) => (
            <Link
              key={hackathon.id}
              href={`/${hackathon.slug}`}
              className="block rounded-xl bg-white p-8 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:ring-2 hover:ring-accent-gold"
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