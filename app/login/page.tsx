"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-state";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { login, isAuthed, user } = useAppState();
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/my");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/my");
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    login(name, email);
    router.push(nextPath);
  }

  return (
    <AppShell title="Login" subtitle="Sign in to manage your hackathon projects.">
      {/* Centered card */}
      <section className="max-w-md mx-auto">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm card-hover animate-fade-in-up">
          {/* Lock icon */}
          <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {isAuthed ? (
            <div className="space-y-4 text-center">
              <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Signed in as</p>
                <p className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {user?.name}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => router.push(nextPath)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-primary"
              >
                Continue to dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[var(--foreground)]">Email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[var(--foreground)]">Display name <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--background)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                />
              </label>

              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-primary"
              >
                Sign in
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </section>
    </AppShell>
  );
}
