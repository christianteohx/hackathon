import { Project } from "@/lib/types";

export function ProjectCard({ project, highlight }: { project: Project; highlight?: boolean }) {
  return (
    <article
      className={`h-full rounded-2xl border p-6 shadow-lg transition-all duration-200
        ${highlight
          ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-white shadow-indigo-200"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl"
        }`}
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">{project.owner}</p>
      <h3 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{project.name}</h3>
      <p className="mt-4 text-base leading-relaxed text-gray-700">{project.summary}</p>
    </article>
  );
}
