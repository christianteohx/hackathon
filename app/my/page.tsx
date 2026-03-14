"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { useAppState } from "@/lib/app-state";

export default function MyPage() {
  const { user, projects, saveProject } = useAppState();
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
    saveProject(memberProject.id, { name, summary });
    setSaved(true);
  }

  return (
    <AppShell title="My Page" subtitle="Choose your project membership and manage your team submission.">
      <AuthGate>
        {!memberProject ? (
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">No project yet</h2>
              <p className="mt-2 text-sm text-slate-600">Create a fresh project for your team.</p>
              <Link href="/my/create" className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white no-underline">
                Create Project
              </Link>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Join existing project</h2>
              <p className="mt-2 text-sm text-slate-600">Use a teammate's join code to join their project.</p>
              <Link href="/my/join" className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white no-underline">
                Join Project
              </Link>
            </article>
          </section>
        ) : (
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Project member view</h2>
              <p className="text-sm text-slate-600">Edit project details and share join code with teammates.</p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              Join code: <span className="font-bold tracking-wide">{memberProject.joinCode}</span>
            </div>

            <form onSubmit={onSave} className="space-y-3">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Project name</span>
                <input
                  value={name}
                  onChange={(e) => {
                    setSaved(false);
                    setName(e.target.value);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Summary</span>
                <textarea
                  value={summary}
                  onChange={(e) => {
                    setSaved(false);
                    setSummary(e.target.value);
                  }}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Save project
              </button>

              {saved ? <p className="text-sm text-emerald-700">Project saved.</p> : null}
            </form>
          </section>
        )}
      </AuthGate>
    </AppShell>
  );
}
