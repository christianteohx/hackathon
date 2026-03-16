"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function HackathonPage({ params }: { params: { slug: string } }) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathon = async () => {
      const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setHackathon(data);
      setLoading(false);
    };

    fetchHackathon();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!hackathon) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-4">{hackathon.name}</h1>
      <p className="text-lg mb-4">{hackathon.description}</p>
      <p className="text-slate-600 mb-2">
        Start: {new Date(hackathon.start_date).toLocaleDateString()}
      </p>
      <p className="text-slate-600 mb-6">
        End: {new Date(hackathon.end_date).toLocaleDateString()}
      </p>

      <div className="flex gap-4">
        <Link
          href={`/leaderboard?hackathon=${hackathon.slug}`}
          className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6"
        >
          View Leaderboard
        </Link>
        <Link
          href={`/vote?hackathon=${hackathon.slug}`}
          className="rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6"
        >
          Vote
        </Link>
      </div>

      <Link href="/" className="mt-8 block text-slate-600 hover:underline">
        ← Back to all hackathons
      </Link>
    </div>
  );
}