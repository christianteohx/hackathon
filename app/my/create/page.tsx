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
      <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Project name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Project Nova"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Project summary</span>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="What does your project do?"
          />
        </label>

        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Create and join project
        </button>
      </form>
    </AppShell>
  );
}
