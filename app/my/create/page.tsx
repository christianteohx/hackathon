"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-state";

export default function CreateProjectPage() {
  const router = useRouter();
  const { createProject, user, requireAuth } = useAppState();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !summary.trim()) return;
    if (!requireAuth("create a project")) {
      return;
    }

    createProject({
      name,
      summary,
      owner: `${user?.name ?? "New"}'s Team`
    });

    router.push("/my");
  }

  return (
    <AppShell title="Create Project" subtitle="Start a new project entry for your team.">
      <section className="max-w-xl animate-fade-in-up">
        <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-white p-6 card-hover space-y-6">
          {/* Project Name */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              Project name <span className="text-[var(--error)]">*</span>
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
              placeholder="Project Nova"
              required
            />
          </label>

          {/* Tagline */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">Tagline</span>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
              placeholder="One sentence that sells your project"
            />
          </label>

          {/* Summary */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              Summary <span className="text-[var(--error)]">*</span>
            </span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none"
              placeholder="Describe what your project does and how it works..."
              required
            />
          </label>

          {/* Links */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">Demo URL</span>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                placeholder="https://your-demo.vercel.app"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">GitHub URL</span>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                placeholder="https://github.com/you/project"
              />
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2">
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create and join project
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
