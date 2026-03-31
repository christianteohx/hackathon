"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-state";
import { supabase } from "@/lib/supabase";

export default function DonePage() {
  const { voteHistory, votePairs, resetVoting } = useAppState();
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchHackathonSlug = async () => {
      const { data } = await supabase
        .from("hackathons")
        .select("slug")
        .eq("is_active", true)
        .limit(1)
        .single();
      if (data) {
        const url = `${window.location.origin}/${(data as { slug: string }).slug}`;
        setShareUrl(url);
      }
    };
    fetchHackathonSlug();
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
    }
  }

  return (
    <AppShell title="Done" subtitle="Thanks for casting your votes!">
      {/* Success Card */}
      <section className="max-w-lg mx-auto">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center card-hover">
          {/* Animated Checkmark */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-[var(--success)]/20 animate-ping" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[var(--success)]">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2
            className="text-2xl font-bold text-[var(--foreground)] mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            You&apos;re all done!
          </h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Thanks for voting. Your voice helped decide the winners.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 py-4 mb-6 rounded-xl bg-[var(--muted)]">
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {voteHistory.length}
              </p>
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Votes Cast
              </p>
            </div>
            <div className="w-px bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                {votePairs.length}
              </p>
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Total Matchups
              </p>
            </div>
          </div>

          {/* Share Section */}
          {shareUrl && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--foreground)] mb-2">
                Share this hackathon
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs text-[var(--muted-foreground)] focus:outline-none truncate"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy link
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                resetVoting();
                router.push("/vote");
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity glow-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Vote again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--muted)] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
