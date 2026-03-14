"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-state";

export default function LoginPage() {
  const [name, setName] = useState("");
  const { login, isAuthed, user } = useAppState();
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/my");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/my");
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    login(name);
    router.push(nextPath);
  }

  return (
    <AppShell title="Login" subtitle="Mock authentication gate for the hackathon voting app.">
      <section className="max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {isAuthed ? (
          <div className="space-y-2">
            <p className="text-sm text-emerald-700">You are already signed in as {user?.name}.</p>
            <button
              type="button"
              onClick={() => router.push(nextPath)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Display name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Login
            </button>
          </form>
        )}
      </section>
    </AppShell>
  );
}
