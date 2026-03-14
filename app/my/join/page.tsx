"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-state";

export default function JoinProjectPage() {
  const router = useRouter();
  const { joinProjectByCode, requireAuth } = useAppState();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!requireAuth("join a project")) {
      return;
    }

    const result = joinProjectByCode(joinCode);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push("/my");
  }

  return (
    <AppShell title="Join Project" subtitle="Enter a project join code from your teammate.">
      <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Join code</span>
          <input
            value={joinCode}
            onChange={(e) => {
              setError("");
              setJoinCode(e.target.value.toUpperCase());
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tracking-wider"
            placeholder="AURORA24"
          />
        </label>

        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Join project
        </button>

        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      </form>
    </AppShell>
  );
}
