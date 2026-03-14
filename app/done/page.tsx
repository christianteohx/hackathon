"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { useAppState } from "@/lib/app-state";

export default function DonePage() {
  const { voteHistory, votePairs, resetVoting } = useAppState();

  return (
    <AppShell title="Done" subtitle="Thanks for voting!">
      <AuthGate>
        <section className="max-w-xl space-y-4 rounded-xl border border-emerald-300 bg-emerald-50 p-5">
          <h2 className="text-xl font-semibold text-emerald-900">Thanks for voting!</h2>
          <p className="text-sm text-emerald-800">
            You completed {voteHistory.length} out of {votePairs.length} matchups.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetVoting}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Vote again
            </button>
            <Link href="/" className="rounded-lg border border-emerald-700 px-4 py-2 text-sm no-underline">
              Back to landing
            </Link>
          </div>
        </section>
      </AuthGate>
    </AppShell>
  );
}
