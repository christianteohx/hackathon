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
      <main className="w-full min-h-screen flex flex-col bg-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col bg-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
          Hackathon Voting<br />Platform
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Discover innovative projects, vote for your favorites, and crown a winner. A clean, fair way to judge hackathon submissions.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/submit"
            className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm"
          >
            Submit a Project
          </Link>
          <Link
            href="/vote"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Start Voting
          </Link>
        </div>
      </section>

      {/* Active Hackathons */}
      <section className="max-w-5xl mx-auto px-6 pb-24 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Hackathons</h2>

        {hackathons.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-600 text-lg">No active hackathons found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {hackathons.map((hackathon) => (
              <Link
                key={hackathon.id}
                href={`/${hackathon.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                      {hackathon.name}
                    </h3>
                    {hackathon.description && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{hackathon.description}</p>
                    )}
                    <p className="mt-3 text-xs text-gray-400">
                      {new Date(hackathon.start_date).toLocaleDateString()} – {new Date(hackathon.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Link href="/leaderboard" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
            View all leaderboards →
          </Link>
        </div>
      </footer>
    </main>
  );
}
