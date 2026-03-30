"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-state";

export default function MyPage() {
  const { user, projects, saveProject, requireAuth } = useAppState();
  const memberProject = useMemo(
    () => projects.find((project) => project.id === user?.projectId),
    [projects, user?.projectId]
  );
  const [name, setName] = useState(memberProject?.name ?? "");
  const [summary, setSummary] = useState(memberProject?.summary ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(memberProject?.name ?? "");
    setSummary(memberProject?.summary ?? "");
  }, [memberProject?.id, memberProject?.name, memberProject?.summary]);

  function onSave(event: FormEvent) {
    event.preventDefault();
    if (!memberProject) return;
    if (!requireAuth("save project edits")) {
      return;
    }

    saveProject(memberProject.id, { name, summary });
    setSaved(true);
  }

  return (
    <AppShell title="Dashboard" subtitle="Manage your hackathon project and team.">
      {!memberProject ? (
        <section className="grid gap-4 sm:grid-cols-2 animate-fade-in-up">
          {/* Create Project Card */}
          <article className="rounded-2xl border border-[var(--border)] bg-white p-6 card-hover">
            <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
              Create a project
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Start a fresh project for your team and get a shareable join code.
            </p>
            <Link
              href="/my/create"
              onClick={(event) => {
                if (!requireAuth("create a project")) {
                  event.preventDefault();
                }
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-primary no-underline"
            >
              Create Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </article>

          {/* Join Project Card */}
          <article className="rounded-2xl border border-[var(--border)] bg-white p-6 card-hover">
            <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
              Join a project
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Use a teammate&apos;s join code to become part of their team.
            </p>
            <Link
              href="/my/join"
              onClick={(event) => {
                if (!requireAuth("join a project")) {
                  event.preventDefault();
                }
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-all no-underline"
            >
              Join Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </article>
        </section>
      ) : (
        <section className="max-w-2xl animate-fade-in-up">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 card-hover">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Your Project
                </h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Edit project details and share the join code with teammates.
                </p>
              </div>
              <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Join Code</p>
                <p className="text-lg font-bold text-[var(--primary)] tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
                  {memberProject.joinCode}
                </p>
              </div>
            </div>

            <form onSubmit={onSave} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[var(--foreground)]">Project name</span>
                <input
                  value={name}
                  onChange={(e) => {
                    setSaved(false);
                    setName(e.target.value);
                  }}
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                  placeholder="Project Nova"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[var(--foreground)]">Summary</span>
                <textarea
                  value={summary}
                  onChange={(e) => {
                    setSaved(false);
                    setSummary(e.target.value);
                  }}
                  rows={4}
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none"
                  placeholder="What does your project do?"
                />
              </label>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save project
                </button>
                
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--success)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Project saved
                  </span>
                )}
              </div>
            </form>
          </div>
        </section>
      )}
    </AppShell>
  );
}
