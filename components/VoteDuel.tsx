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
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Vote Confirmed!</h2>
          <span className="text-sm text-gray-500 font-medium">{progress}</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className={`rounded-xl p-5 border-2 ${winner.id === votedWinnerId ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {winner.id === votedWinnerId ? '✓ Winner' : 'Other project'}
            </p>
            {isBlindMode ? (
              <p className="text-gray-400 italic py-4">Project Hidden</p>
            ) : (
              <ProjectCard project={winner} />
            )}
          </div>
          <div className="rounded-xl p-5 border-2 border-gray-200 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Other project</p>
            {isBlindMode ? (
              <p className="text-gray-400 italic py-4">Project Hidden</p>
            ) : (
              <ProjectCard project={loser} />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-8 w-full rounded-xl bg-blue-500 text-white px-6 py-4 text-lg font-bold hover:bg-blue-600 transition-colors shadow-sm"
        >
          Continue to Next Vote →
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">Which project is better?</h2>
        <span className="text-sm text-gray-500 font-medium">{progress}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left */}
        <div className="flex flex-col gap-4">
          {isBlindMode ? (
            <div className="rounded-xl bg-gray-100 border border-gray-200 p-12 text-center">
              <p className="text-gray-400 italic">Project hidden in blind mode</p>
            </div>
          ) : (
            <ProjectCard project={left} />
          )}
          <button
            type="button"
            onClick={() => handleVote(left.id)}
            className="w-full rounded-xl bg-blue-500 text-white px-6 py-4 text-lg font-bold hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Vote for this
          </button>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {isBlindMode ? (
            <div className="rounded-xl bg-gray-100 border border-gray-200 p-12 text-center">
              <p className="text-gray-400 italic">Project hidden in blind mode</p>
            </div>
          ) : (
            <ProjectCard project={right} />
          )}
          <button
            type="button"
            onClick={() => handleVote(right.id)}
            className="w-full rounded-xl bg-blue-500 text-white px-6 py-4 text-lg font-bold hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Vote for this
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
