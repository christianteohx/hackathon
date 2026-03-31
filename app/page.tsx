"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CountdownTimer } from "@/components/CountdownTimer";

interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  voting_deadline: string | null;
  announcements: string | null;
}

export default function HomePage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingDeadline, setVotingDeadline] = useState<Date | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    const fetchHackathons = async () => {
      const { data, error } = await (supabase as any)
        .from("hackathons")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: false });

      if (!error && data) {
        setHackathons(data as Hackathon[]);
        if (data.length > 0) {
          const activeHackathon = data[0] as Hackathon;
          if (activeHackathon.voting_deadline) {
            setVotingDeadline(new Date(activeHackathon.voting_deadline));
          }
          if (activeHackathon.announcements) {
            setAnnouncement(activeHackathon.announcements);
            // Check if previously dismissed
            try {
              const dismissed = localStorage.getItem(`hackathon_announcement_dismissed_${activeHackathon.id}_${activeHackathon.announcements}`);
              if (dismissed) setAnnouncementDismissed(true);
            } catch {}
          }
        }
      }
      setLoading(false);
    };

    fetchHackathons();
  }, []);

  const dismissAnnouncement = () => {
    setAnnouncementDismissed(true);
    // Remember dismissal for this hackathon
    if (hackathons.length > 0 && announcement) {
      try {
        localStorage.setItem(`hackathon_announcement_dismissed_${hackathons[0].id}_${announcement}`, 'true');
      } catch {}
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="absolute inset-0 noise-overlay" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[var(--success)]/10 blur-3xl" />
        
        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            {/* Announcement Banner */}
            {announcement && !announcementDismissed && (
              <div className="mb-6 animate-fade-in-up">
                <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[var(--foreground)]">Announcement</p>
                      <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{announcement}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={dismissAnnouncement}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    aria-label="Dismiss announcement"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Badge */}
            <div className="mb-8 animate-fade-in-up">
              <CountdownTimer deadline={votingDeadline} label="Voting ends" />
            </div>
            
            {/* Heading */}
            <h1 
              className="text-5xl md:text-7xl font-bold text-[var(--foreground)] tracking-tight leading-[0.95] mb-6 animate-fade-in-up stagger-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Build. Vote.
              <br />
              <span className="text-[var(--primary)]">Win.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mt-6 text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
              The fairest way to judge hackathon submissions. 
              Blind voting, live leaderboards, and Elo-based rankings.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-semibold text-base hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/25 glow-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Project
              </Link>
              <Link
                href="/vote"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-base hover:bg-[var(--muted)] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Voting
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Active Hackathons */}
      <section className="flex-1 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-6 py-16 w-full">
          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 
                className="text-3xl font-bold text-[var(--foreground)] tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Active Hackathons
              </h2>
              <p className="mt-2 text-[var(--muted-foreground)]">
                Join an event and start competing
              </p>
            </div>
            <Link 
              href="/leaderboard" 
              className="text-sm font-semibold text-[var(--primary)] hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-[var(--border)] bg-white p-6 animate-pulse">
                  <div className="h-6 w-32 bg-[var(--muted)] rounded mb-3" />
                  <div className="h-4 w-full bg-[var(--muted)] rounded mb-2" />
                  <div className="h-4 w-3/4 bg-[var(--muted)] rounded" />
                </div>
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--border)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-[var(--foreground)] mb-2">No active hackathons</p>
              <p className="text-[var(--muted-foreground)]">Check back soon for upcoming events!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {hackathons.map((hackathon, idx) => (
                <Link
                  key={hackathon.id}
                  href={`/${hackathon.slug}`}
                  className={`group rounded-xl border border-[var(--border)] bg-white p-6 card-hover animate-fade-in-up stagger-${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Status badge */}
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-xs font-semibold mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                        Active
                      </div>
                      
                      <h3 
                        className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {hackathon.name}
                      </h3>
                      
                      {hackathon.description && (
                        <p className="mt-2 text-sm text-[var(--muted-foreground)] line-clamp-2">
                          {hackathon.description}
                        </p>
                      )}
                      
                      <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                        {new Date(hackathon.start_date).toLocaleDateString()} – {new Date(hackathon.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Powered by Hackathon Voting Platform
          </p>
          <Link 
            href="/leaderboard" 
            className="text-sm font-semibold text-[var(--primary)] hover:opacity-80 transition-opacity"
          >
            View leaderboards →
          </Link>
        </div>
      </footer>
    </main>
  );
}
