import Link from "next/link";
import { ReactNode } from "react";

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-8">
      <header className="space-y-3">
        <nav className="flex flex-wrap gap-3 text-sm">
          <Link href="/">Home</Link>
          <Link href="/vote">Vote</Link>
          <Link href="/my">My Page</Link>
          <Link href="/login">Login</Link>
        </nav>

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
        </div>
      </header>

      {children}
    </main>
  );
}
