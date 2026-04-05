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
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !summary.trim()) return;
    if (!requireAuth("create a project")) return;

    setSubmitting(true);
    await createProject({
      name: name.trim(),
      summary: summary.trim(),
      owner: `${user?.name ?? "Team"}'s Project`
    });
    router.push("/my");
  }

  return (
    <AppShell title="Create Project" subtitle="Start a new project for your team.">
      <section className="max-w-xl animate-fade-in-up">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-[var(--border)] bg-white p-6 card-hover space-y-6"
        >
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

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-[var(--primary)] text-white font-semibold py-3 px-6 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Project"}
            </button>
            <a
              href="/my"
              className="rounded-xl border border-[var(--border)] px-6 py-3 font-semibold hover:bg-[var(--muted)] transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
