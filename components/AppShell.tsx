import Link from "next/link";
import { ReactNode } from "react";

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <header className="space-y-5">
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-700">
          <Link href="/" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 no-underline shadow-sm hover:border-slate-400">
            Home
          </Link>
          <Link href="/vote" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 no-underline shadow-sm hover:border-slate-400">
            Vote
          </Link>
          <Link href="/my" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 no-underline shadow-sm hover:border-slate-400">
            My Page
          </Link>
          <Link href="/login" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 no-underline shadow-sm hover:border-slate-400">
            Login
          </Link>
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
