"use client";
import { useState } from "react";
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

  const handleVote = (winnerId: string) => {
    if (isBlindMode) {
      setVotedWinnerId(winnerId);
      setVoteConfirmed(true);
    } else {
      onVote(winnerId);
    }
  };

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
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Vote Confirmed!
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Here&apos;s what you just voted on:
            </p>
          </div>
          <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {progress}
          </span>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-6">
            <div className="mb-2 text-2xl">✅</div>
            <p className="text-sm font-semibold text-emerald-900">
              Your Vote: <span className="font-bold">{winner.name}</span>
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              {winner.owner} — {winner.tagline || winner.description?.slice(0, 100)}
              {winner.description && winner.description.length > 100 ? "..." : ""}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <p className="mb-2 text-sm font-semibold text-slate-700">Opponent:</p>
            <p className="text-xs text-slate-600">
              <span className="font-medium">{loser.name}</span> — {loser.owner}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {loser.tagline || loser.description?.slice(0, 100)}
              {loser.description && loser.description.length > 100 ? "..." : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Continue to Next Vote
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Pick the stronger project
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {isBlindMode
              ? "Compare left vs right (names hidden) and cast one vote."
              : "Compare left vs right and cast one vote."}
          </p>
        </div>
        <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {progress}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {/* Left Project */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Left Project
          </p>
          {isBlindMode ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div className="mb-3 text-4xl">🎭</div>
              <p className="text-sm font-semibold text-slate-700">
                Project Name Hidden
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Vote based on description only
              </p>
              {left.description && (
                <div className="mt-4 rounded-lg bg-white p-3 text-left">
                  <p className="text-xs font-semibold text-slate-600">
                    Description:
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {left.description}
                  </p>
                </div>
              )}
              {left.tagline && (
                <div className="mt-2 rounded-lg bg-white p-3 text-left">
                  <p className="text-xs font-semibold text-slate-600">
                    Tagline:
                  </p>
                  <p className="mt-1 text-sm text-slate-700 italic">
                    &quot;{left.tagline}&quot;
                  </p>
                </div>
              )}
            </div>
          ) : (
            <ProjectCard project={left} />
          )}
          <button
            type="button"
            onClick={() => handleVote(left.id)}
            className="w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Vote Left
          </button>
        </div>

        {/* Right Project */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Right Project
          </p>
          {isBlindMode ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div className="mb-3 text-4xl">🎭</div>
              <p className="text-sm font-semibold text-slate-700">
                Project Name Hidden
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Vote based on description only
              </p>
              {right.description && (
                <div className="mt-4 rounded-lg bg-white p-3 text-left">
                  <p className="text-xs font-semibold text-slate-600">
                    Description:
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {right.description}
                  </p>
                </div>
              )}
              {right.tagline && (
                <div className="mt-2 rounded-lg bg-white p-3 text-left">
                  <p className="text-xs font-semibold text-slate-600">
                    Tagline:
                  </p>
                  <p className="mt-1 text-sm text-slate-700 italic">
                    &quot;{right.tagline}&quot;
                  </p>
                </div>
              )}
            </div>
          ) : (
            <ProjectCard project={right} />
          )}
          <button
            type="button"
            onClick={() => handleVote(right.id)}
            className="w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Vote Right
          </button>
        </div>
      </div>
    </section>
  );
}
