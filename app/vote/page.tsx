"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { VoteDuel } from "@/components/VoteDuel";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useAppState } from "@/lib/app-state";
import { supabase } from "@/lib/supabase";

const SESSION_VOTES_LIMIT = 3;

function getSessionVotedPairIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("hackathon_voted_pairs");
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function getSessionVotesRemaining(): number {
  if (typeof window === "undefined") return SESSION_VOTES_LIMIT;
  try {
    const stored = localStorage.getItem("hackathon_session_votes_remaining");
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch {
    // ignore
  }
  return SESSION_VOTES_LIMIT;
}

function setSessionVotesRemaining(remaining: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("hackathon_session_votes_remaining", String(remaining));
  } catch {
    // ignore
  }
}

export default function VotePage() {
  const {
    currentPair,
    projects,
    castVote,
    voteHistory,
    votePairs,
    requireAuth,
    isBlindMode,
    toggleBlindMode,
    isAnonymousMode,
    toggleAnonymousMode,
  } = useAppState();

  const router = useRouter();
  const [voteCount, setVoteCount] = useState(0);
  const [votesRemaining, setVotesRemaining] = useState(SESSION_VOTES_LIMIT);
  const [totalVotes, setTotalVotes] = useState<number | null>(null);
  const [votingDeadline, setVotingDeadline] = useState<Date | null>(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    setVoteCount(getSessionVotedPairIds().size);
    setVotesRemaining(getSessionVotesRemaining());
  }, []);

  // Fetch total global vote count from Supabase
  useEffect(() => {
    const fetchTotalVotes = async () => {
      const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });
      if (!error && count !== null) {
        setTotalVotes(count);
      }
    };
    fetchTotalVotes();
  }, []);

  // Fetch voting deadline
  useEffect(() => {
    const fetchVotingDeadline = async () => {
      const { data, error } = await (supabase as any)
        .from('hackathons')
        .select('voting_deadline')
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();
      if (!error && data?.voting_deadline) {
        setVotingDeadline(new Date(data.voting_deadline));
      }
    };
    fetchVotingDeadline();
  }, []);

  useEffect(() => {
    if (!currentPair) {
      router.replace("/done");
    }
  }, [currentPair, router]);

  // Session timeout warning — show "Still there?" after 10 minutes of inactivity
  useEffect(() => {
    const TIMEOUT_MS = 10 * 60 * 1000;
    let warningTimer: ReturnType<typeof setTimeout>;
    let dismissed = false;

    const resetTimer = () => {
      clearTimeout(warningTimer);
      dismissed = false;
      setShowTimeoutWarning(false);
      if (currentPair) {
        warningTimer = setTimeout(() => {
          if (!dismissed) setShowTimeoutWarning(true);
        }, TIMEOUT_MS);
      }
    };

    const handleActivity = () => {
      if (dismissed) {
        resetTimer();
      } else {
        resetTimer();
      }
    };

    // Start the timer on mount
    warningTimer = setTimeout(() => {
      if (!dismissed) setShowTimeoutWarning(true);
    }, TIMEOUT_MS);

    // Reset on user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    return () => {
      clearTimeout(warningTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [currentPair]);

  const dismissTimeoutWarning = () => {
    setShowTimeoutWarning(false);
  };

  // Out of session votes — show encouraging empty state
  if (votesRemaining <= 0) {
    return (
      <AppShell title="🗳️ Voting" subtitle="You&apos;ve used all your votes for today!">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-16 text-center animate-scale-in">
          {/* Trophy illustration */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2
            className="text-2xl font-bold text-[var(--foreground)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Come back tomorrow!
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
            You&apos;ve used all 3 of your votes for this session. New voting tokens refresh daily — or submit your own project to get more involved!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Submit a Project
            </a>
            <a
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--muted)] transition-all"
            >
              View Leaderboard
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!currentPair) {
    return (
      <AppShell title="🗳️ Voting" subtitle="">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-16 text-center animate-scale-in">
          {/* Checkmark illustration */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2
            className="text-2xl font-bold text-[var(--foreground)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            You&apos;ve seen all projects!
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
            You&apos;ve voted on every matchup. Come back later when more projects are submitted!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View Leaderboard
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--muted)] transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  const leftProject = projects.find(
    (project) => project.id === currentPair.leftProjectId
  );
  const rightProject = projects.find(
    (project) => project.id === currentPair.rightProjectId
  );

  if (!leftProject || !rightProject) {
    return (
      <AppShell title="Vote" subtitle="Project pair unavailable.">
        <p className="text-sm text-[var(--error)]">
          Unable to load the current vote pair.
        </p>
      </AppShell>
    );
  }

  const progress = `${voteHistory.length}/${votePairs.length} matchups voted`;
  const pair = currentPair;

  function handleVote(winnerId: string) {
    if (!requireAuth("cast a vote")) {
      return;
    }
    if (votesRemaining <= 0) return;
    castVote(winnerId);
    const newRemaining = votesRemaining - 1;
    setVotesRemaining(newRemaining);
    setSessionVotesRemaining(newRemaining);
    setVoteCount(getSessionVotedPairIds().size);
    if (voteHistory.length + 1 >= votePairs.length) {
      router.push("/done");
    } else {
      router.push("/vote");
    }
  }

  return (
    <AppShell 
      title="🗳️ Voting" 
      subtitle="Pick the better project in each matchup. All votes are anonymous."
    >
      {/* Countdown Timer */}
      <div className="mb-6">
        <CountdownTimer deadline={votingDeadline} label="Voting ends" />
      </div>

      {/* Blind Mode Toggle */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 
              className="text-sm font-semibold text-[var(--foreground)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Blind Voting Mode
            </h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Hide project and team names while voting to reduce bias. Names are revealed after you cast your vote.
            </p>
          </div>
          <div className="tooltip-wrapper">
            <button
              type="button"
              onClick={toggleBlindMode}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                isBlindMode ? "bg-[var(--primary)]" : "bg-[var(--muted-foreground)]/30"
              }`}
              aria-pressed={isBlindMode}
              aria-label={isBlindMode ? "Disable blind voting mode" : "Enable blind voting mode"}
            >
              <span className="sr-only">Toggle blind voting mode</span>
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isBlindMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="tooltip-content">Toggle to hide/show project names while voting</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
              isBlindMode
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--border)] text-[var(--muted-foreground)]"
            }`}
          >
            {isBlindMode ? "✓ Blind mode ON" : "Blind mode OFF"}
          </span>
          {isBlindMode && (
            <span className="text-xs text-[var(--muted-foreground)]">Project names hidden during voting</span>
          )}
        </div>
      </div>

      {/* Session Timeout Warning */}
      {showTimeoutWarning && (
        <div className="mb-6 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-4 flex items-center justify-between gap-4 animate-soft-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--warning)]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Still there?</p>
              <p className="text-xs text-[var(--muted-foreground)]">Your session is still active. Keep voting!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissTimeoutWarning}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            Got it
          </button>
        </div>
      )}

      {/* Session Votes Remaining Banner */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)] px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            You have <span className="text-[var(--primary)]">{votesRemaining}</span> vote{votesRemaining !== 1 ? 's' : ''} remaining
          </span>
        </div>
        <span className="text-xs text-[var(--muted-foreground)]">Votes reset daily</span>
      </div>

      {/* Vote Duel */}
      <VoteDuel
        left={leftProject}
        right={rightProject}
        onVote={handleVote}
        progress={progress}
        isBlindMode={isBlindMode}
      />

      {/* Voting Progress */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[var(--muted-foreground)]">
        <p>
          You've voted on{' '}
          <span className="tooltip-wrapper">
            <span className="font-semibold text-[var(--foreground)]">{voteCount}</span>
            <span className="tooltip-content">Number of matchups you&apos;ve voted on in this browser session</span>
          </span>
          {' '}matchup{voteCount !== 1 ? 's' : ''} this session
        </p>
        {totalVotes !== null && (
          <>
            <span className="hidden sm:inline text-[var(--border)]">·</span>
            <p>
              <span className="font-semibold text-[var(--foreground)]">{totalVotes.toLocaleString()}</span>
              {' '}total vote{totalVotes !== 1 ? 's' : ''} cast
            </p>
          </>
        )}
      </div>

      {/* Need to update link */}
      <div className="mt-4 text-center">
        <Link href="/my" className="text-sm text-[var(--primary)] hover:opacity-80 transition-opacity">
          Need to update your project first?
        </Link>
      </div>
    </AppShell>
  );
}
