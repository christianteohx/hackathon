"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAppState } from "@/lib/app-state";

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { isAuthed, user, logout, openAuthModal } = useAppState();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <header className="space-y-5">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          <Link href="/" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 no-underline shadow-sm hover:border-slate-400">
            Home
          </Link>
          <Link href="/vote" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 no-underline shadow-sm hover:border-slate-400">
            Vote
          </Link>
          <Link href="/my" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 no-underline shadow-sm hover:border-slate-400">
            My Page
          </Link>

          {!isAuthed ? (
            <button
              type="button"
              onClick={() => openAuthModal("sign in")}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 shadow-sm hover:border-slate-400"
            >
              Login / Register
            </button>
          ) : (
            <>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          {subtitle ? <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{subtitle}</p> : null}
        </div>
      </header>

      {children}
    </main>
  );
}
