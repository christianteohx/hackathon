"use client";

import { useState, useEffect, useCallback } from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function VoteDuel({
  left,
  right,
  onVote,
  progress,
  isBlindMode,
}: {
  left: Project;
  right: Project;
  onVote: (winnerId: string) => void;
  progress: string;
  isBlindMode: boolean;
}) {
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [votedWinnerId, setVotedWinnerId] = useState<string | null>(null);
  // Animation state for card exit
  const [animatingOut, setAnimatingOut] = useState<"left" | "right" | null>(null);
  const [fadeKey, setFadeKey] = useState(0); // increments to trigger fade-in on new pair

  // Fade in when a new pair mounts (key changes)
  useEffect(() => {
    setFadeKey((k) => k + 1);
  }, [left.id, right.id]);

  const handleVote = useCallback((winnerId: string) => {
    // Determine which card to animate out (the loser)
    const loser = winnerId === left.id ? right.id : left.id;
    const loserSide = winnerId === left.id ? "right" : "left";

    setAnimatingOut(loserSide);

    // After animation completes, call onVote and show confirmation
    const timer = setTimeout(() => {
      setAnimatingOut(null);
      if (isBlindMode) {
        setVotedWinnerId(winnerId);
        setVoteConfirmed(true);
      } else {
        onVote(winnerId);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [left.id, right.id, isBlindMode, onVote]);

  const handleContinue = () => {
    if (votedWinnerId) {
      onVote(votedWinnerId);
      setVoteConfirmed(false);
      setVotedWinnerId(null);
    }
  };

  const getRevealedProject = (winnerId: string) => {
    const isLeftWinner = winnerId === left.id;
    return {
      winner: isLeftWinner ? left : right,
      loser: isLeftWinner ? right : left,
    };
  };

  if (voteConfirmed && isBlindMode && votedWinnerId) {
    const { winner, loser } = getRevealedProject(votedWinnerId);

    return (
      <section className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-[var(--foreground)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vote Confirmed!
            </h2>
          </div>
          <span className="text-sm font-medium text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full">
            {progress}
          </span>
        </div>

        {/* Revealed projects */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className={`rounded-xl p-5 border-2 transition-all ${
            winner.id === votedWinnerId
              ? 'border-[var(--success)] bg-[var(--success)]/5 shadow-lg'
              : 'border-[var(--border)] bg-[var(--muted)]'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              winner.id === votedWinnerId ? 'text-[var(--success)]' : 'text-[var(--muted-foreground)]'
            }`}>
              {winner.id === votedWinnerId ? '✓ Winner' : 'Other project'}
            </p>
            {isBlindMode ? (
              <div className="rounded-lg bg-white p-4 text-center">
                <p className="font-semibold text-[var(--foreground)]">{winner.name}</p>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{winner.team_name || winner.owner || 'Unknown Team'}</p>
              </div>
            ) : (
              <ProjectCard project={winner} />
            )}
          </div>
          <div className="rounded-xl p-5 border-2 border-[var(--border)] bg-[var(--muted)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Other project</p>
            {isBlindMode ? (
              <div className="rounded-lg bg-white p-4 text-center">
                <p className="font-semibold text-[var(--foreground)]">{loser.name}</p>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{loser.team_name || loser.owner || 'Unknown Team'}</p>
              </div>
            ) : (
              <ProjectCard project={loser} />
            )}
          </div>
        </div>

        {/* Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          className="mt-8 w-full rounded-xl bg-[var(--primary)] text-white px-6 py-4 text-lg font-bold hover:opacity-90 transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
        >
          Continue to Next Vote
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </section>
    );
  }

  return (
    <section
      key={fadeKey}
      className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm animate-vote-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl font-bold text-[var(--foreground)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Which project is better?
        </h2>
        <span className="text-sm font-medium text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full">
          {progress}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Project */}
        <div className="flex flex-col gap-4">
          <div
            className={
              animatingOut === "left"
                ? "animate-slide-out-left"
                : animatingOut !== null
                ? "opacity-40 transition-opacity duration-300"
                : ""
            }
          >
            {isBlindMode ? (
              <div className="rounded-xl bg-[var(--muted)] border border-[var(--border)] p-12 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--border)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </div>
                <p className="text-[var(--muted-foreground)] font-medium">Project hidden in blind mode</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Names revealed after voting</p>
              </div>
            ) : (
              <ProjectCard project={left} />
            )}
          </div>
          <button
            type="button"
            onClick={() => handleVote(left.id)}
            className="w-full rounded-xl bg-[var(--primary)] text-white px-6 py-4 text-lg font-bold hover:opacity-90 transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>Vote for this</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Right Project */}
        <div className="flex flex-col gap-4">
          <div
            className={
              animatingOut === "right"
                ? "animate-slide-out-right"
                : animatingOut !== null
                ? "opacity-40 transition-opacity duration-300"
                : ""
            }
          >
            {isBlindMode ? (
              <div className="rounded-xl bg-[var(--muted)] border border-[var(--border)] p-12 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--border)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </div>
                <p className="text-[var(--muted-foreground)] font-medium">Project hidden in blind mode</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Names revealed after voting</p>
              </div>
            ) : (
              <ProjectCard project={right} />
            )}
          </div>
          <button
            type="button"
            onClick={() => handleVote(right.id)}
            className="w-full rounded-xl bg-[var(--primary)] text-white px-6 py-4 text-lg font-bold hover:opacity-90 transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>Vote for this</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
