import { Project } from "@/lib/types";

export function ProjectCard({ project, highlight }: { project: Project; highlight?: boolean }) {
  return (
    <article
      className={`rounded-xl border p-4 shadow-sm transition sm:p-5 ${
        highlight ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-semibold uppercase text-slate-500">{project.owner}</p>
      <h3 className="mt-1 text-lg font-semibold">{project.name}</h3>
      <p className="mt-3 text-sm text-slate-700">{project.summary}</p>
    </article>
  );
}
