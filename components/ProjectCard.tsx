import { Project } from "@/lib/types";

export function ProjectCard({ project, highlight }: { project: Project; highlight?: boolean }) {
  return (
    <article
      className={`h-full rounded-2xl border p-5 shadow-sm transition sm:p-6 ${
        highlight
          ? "border-blue-400 bg-gradient-to-b from-blue-50 to-white shadow-blue-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{project.owner}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{project.name}</h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">{project.summary}</p>
    </article>
  );
}
