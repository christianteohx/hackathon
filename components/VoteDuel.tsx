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
      <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Vote Confirmed!</h2>
          <span className="text-sm text-gray-500">{progress}</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className={`rounded-xl p-4 ${winner.id === votedWinnerId ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-semibold text-gray-600">
              {winner.id === votedWinnerId ? 'Winner' : 'Runner-up'}
            </h3>
            {isBlindMode ? (
              <p className="mt-2 text-gray-400 italic">Project Hidden</p>
            ) : (
              <ProjectCard project={winner} />
            )}
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-600">Other Project</h3>
            {isBlindMode ? (
              <p className="mt-2 text-gray-400 italic">Project Hidden</p>
            ) : (
              <ProjectCard project={loser} />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-xl bg-purple-700 text-white px-4 py-3 text-lg font-bold shadow-md hover:bg-purple-800 transition-all duration-200"
        >
          Continue to Next Vote
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Which project is better?</h2>
        <span className="text-sm text-gray-500">{progress}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {isBlindMode ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center">
              <p className="text-gray-400 italic">Project Hidden (Blind Mode)</p>
            </div>
          ) : (
            <ProjectCard project={left} />
          )}
          <button
            type="button"
            onClick={() => handleVote(left.id)}
            className="w-full rounded-xl bg-purple-700 text-white px-4 py-3 text-lg font-bold shadow-md hover:bg-purple-800 transition-all duration-200"
          >
            Vote Left
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {isBlindMode ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center">
              <p className="text-gray-400 italic">Project Hidden (Blind Mode)</p>
            </div>
          ) : (
            <ProjectCard project={right} />
          )}
          <button
            type="button"
            onClick={() => handleVote(right.id)}
            className="w-full rounded-xl bg-purple-700 text-white px-4 py-3 text-lg font-bold shadow-md hover:bg-purple-800 transition-all duration-200"
          >
            Vote Right
          </button>
        </div>
      </div>
    </section>
  );
}
