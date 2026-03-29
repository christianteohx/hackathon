import { Project } from "@/lib/types";

export function ProjectCard({ project, highlight }: { project: Project; highlight?: boolean }) {
  const description = project.summary || project.tagline || "No description provided.";

  return (
    <article
      className={`h-full rounded-xl border p-5 flex flex-col transition-all duration-200
        ${highlight
          ? "border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-blue-100"
          : "border-gray-200 bg-white hover:shadow-lg hover:border-gray-300"
        }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{project.owner || "Unknown Team"}</p>
      <h3 className="mt-3 text-xl font-bold text-gray-900 leading-tight">{project.name}</h3>
      {project.tagline && (
        <p className="mt-1.5 text-sm font-medium text-blue-500 leading-snug">{project.tagline}</p>
      )}
      <p className="mt-4 text-sm leading-relaxed text-gray-600 flex-1">{description}</p>
      {project.tags && project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
