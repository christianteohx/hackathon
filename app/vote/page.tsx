"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { VoteDuel } from "@/components/VoteDuel";
import { useAppState } from "@/lib/app-state";

// localStorage-based vote protection
function getVotedPairs(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("votedPairs");
  return stored ? JSON.parse(stored) : [];
}

function markPairVoted(leftId: string, rightId: string) {
  const key = [leftId, rightId].sort().join("|");
  const pairs = getVotedPairs();
  if (!pairs.includes(key)) {
    pairs.push(key);
    localStorage.setItem("votedPairs", JSON.stringify(pairs));
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
  } = useAppState();

  const router = useRouter();
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    setVoteCount(getVotedPairs().length);
  }, []);

  useEffect(() => {
    if (!currentPair) {
      router.replace("/done");
    }
  }, [currentPair, router]);

  if (!currentPair) {
    return null;
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
    markPairVoted(pair.leftProjectId, pair.rightProjectId);
    setVoteCount(getVotedPairs().length);
    castVote(winnerId);
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

      {/* Vote Duel */}
      <VoteDuel
        left={leftProject}
        right={rightProject}
        onVote={handleVote}
        progress={progress}
        isBlindMode={isBlindMode}
      />

      {/* Vote count */}
      <p className="mt-6 text-sm text-[var(--muted-foreground)] text-center">
        You've voted on <span className="font-semibold text-[var(--foreground)]">{voteCount}</span> matchups.
      </p>

      {/* Need to update link */}
      <div className="mt-4 text-center">
        <Link href="/my" className="text-sm text-[var(--primary)] hover:opacity-80 transition-opacity">
          Need to update your project first?
        </Link>
      </div>
    </AppShell>
  );
}
