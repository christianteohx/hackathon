"use client";

import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function VoteDuel({
  left,
  right,
  onVote,
  progress
}: {
  left: Project;
  right: Project;
  onVote: (winnerId: string) => void;
  progress: string;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Which project better?</h2>
        <span className="text-xs font-medium text-slate-500">{progress}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <ProjectCard project={left} />
          <button
            type="button"
            onClick={() => onVote(left.id)}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Vote Left
          </button>
        </div>

        <div className="space-y-2">
          <ProjectCard project={right} />
          <button
            type="button"
            onClick={() => onVote(right.id)}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Vote Right
          </button>
        </div>
      </div>
    </section>
  );
}
