"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { VoteDuel } from "@/components/VoteDuel";
import { useAppState } from "@/lib/app-state";

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
        <p className="text-sm text-rose-700">
          Unable to load the current vote pair.
        </p>
      </AppShell>
    );
  }

  const progress = `${voteHistory.length}/${votePairs.length} matchups voted`;

  function handleVote(winnerId: string) {
    if (!requireAuth("cast a vote")) {
      return;
    }
    castVote(winnerId);
    if (voteHistory.length + 1 >= votePairs.length) {
      router.push("/done");
    } else {
      router.push("/vote");
    }
  }

  return (
    <AppShell
      title="Voting Flow"
      subtitle="Record votes and continue until all project matchups are done."
    >
      {/* Blind Mode Toggle */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Blind Voting Mode
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Hide project and team names while voting to reduce bias. Names
              will still be visible after you cast your vote.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleBlindMode}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 ${
              isBlindMode ? "bg-slate-900" : "bg-slate-300"
            }`}
            aria-pressed={isBlindMode}
            aria-label={
              isBlindMode
                ? "Disable blind voting mode"
                : "Enable blind voting mode"
            }
          >
            <span className="sr-only">Toggle blind voting mode</span>
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isBlindMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isBlindMode ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {isBlindMode ? "✓ Blind mode ON" : "Blind mode OFF"}
          </span>
          {isBlindMode && (
            <span className="text-xs text-slate-500">
              Project names hidden during voting
            </span>
          )}
        </div>
      </div>

      <VoteDuel
        left={leftProject}
        right={rightProject}
        onVote={handleVote}
        progress={progress}
        isBlindMode={isBlindMode}
      />

      <div>
        <Link href="/my" className="text-sm">
          Need to update your project first?
        </Link>
      </div>
    </AppShell>
  );
}
