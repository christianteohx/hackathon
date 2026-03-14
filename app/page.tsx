"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleHealthCheck() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      setResult(JSON.stringify(data));
    } catch {
      setResult("Request failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Hackathon Platform</h1>
        <p className="text-sm text-slate-600">
          Auth, profile, project ownership, and voting navigation shell.
        </p>
      </div>

      <nav className="flex gap-4">
        <Link href="/submit">/submit</Link>
        <Link href="/login">/login</Link>
        <Link href="/my">/my</Link>
        <Link href="/vote">/vote</Link>
        <Link href="/leaderboard">/leaderboard</Link>
      </nav>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleHealthCheck}
          className="rounded border border-slate-300 px-4 py-2"
        >
          {isLoading ? "Checking..." : "Call /api/health"}
        </button>

        {result ? (
          <pre className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
            {result}
          </pre>
        ) : null}
      </div>
    </main>
  );
}
