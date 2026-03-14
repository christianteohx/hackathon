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
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Pick the stronger project</h2>
          <p className="mt-1 text-sm text-slate-600">Compare left vs right and cast one vote.</p>
        </div>
        <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {progress}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Left Project</p>
          <ProjectCard project={left} />
          <button
            type="button"
            onClick={() => onVote(left.id)}
            className="w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Vote Left
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Right Project</p>
          <ProjectCard project={right} />
          <button
            type="button"
            onClick={() => onVote(right.id)}
            className="w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Vote Right
          </button>
        </div>
      </div>
    </section>
  );
}
