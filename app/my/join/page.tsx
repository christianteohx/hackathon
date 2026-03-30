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
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!requireAuth("join a project")) {
      return;
    }

    setIsLoading(true);
    const result = joinProjectByCode(joinCode);

    if (!result.ok) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    router.push("/my");
  }

  return (
    <AppShell title="Join Project" subtitle="Enter your teammate's join code to become part of their team.">
      <section className="max-w-md animate-fade-in-up">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 card-hover">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">Join code</span>
              <input
                value={joinCode}
                onChange={(e) => {
                  setError("");
                  setJoinCode(e.target.value.toUpperCase());
                }}
                className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-4 text-lg tracking-[0.2em] text-center font-bold placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                placeholder="AURORA24"
                maxLength={12}
                required
              />
            </label>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20">
                <svg className="w-5 h-5 text-[var(--error)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-[var(--error)]">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || !joinCode.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Joining...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Join project
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
            Ask your teammate for their project&apos;s join code found on their dashboard.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
