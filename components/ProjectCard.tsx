"use client";

import { Project } from "@/lib/types";

export function ProjectCard({ project, highlight }: { project: Project; highlight?: boolean }) {
  const description = project.summary || project.tagline || "No description provided.";

  return (
    <article
      className={`h-full rounded-xl border p-5 flex flex-col transition-all duration-200 card-hover
        ${highlight
          ? "border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/5 to-white shadow-lg"
          : "border-[var(--border)] bg-white hover:shadow-lg hover:border-[var(--muted-foreground)]/20"
        }`}
    >
      {/* Owner */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {project.owner || "Unknown Team"}
        </p>
        {highlight && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        )}
      </div>
      
      {/* Name */}
      <h3 
        className="mt-3 text-xl font-bold text-[var(--foreground)] leading-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {project.name}
      </h3>
      
      {/* Tagline */}
      {project.tagline && (
        <p className="mt-2 text-sm font-semibold text-[var(--primary)] leading-snug">
          {project.tagline}
        </p>
      )}
      
      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)] flex-1">
        {description}
      </p>
      
      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Links */}
      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[var(--border)]">
        {project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Demo
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        )}
      </div>
    </article>
  );
}
