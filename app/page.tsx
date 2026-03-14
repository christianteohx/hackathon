"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { VoteDuel } from "@/components/VoteDuel";
import { useAppState } from "@/lib/app-state";

export default function LandingPage() {
  const { currentPair, projects, castVote, voteHistory, votePairs } = useAppState();
  const router = useRouter();

  const leftProject = projects.find((p) => p.id === currentPair?.leftProjectId);
  const rightProject = projects.find((p) => p.id === currentPair?.rightProjectId);

  const progress = `${voteHistory.length}/${votePairs.length} matchups voted`;

  function handleVote(winnerId: string) {
    castVote(winnerId);
    if (voteHistory.length + 1 >= votePairs.length) {
      router.push("/done");
    } else {
      router.push("/vote");
    }
  }

  return (
    <AppShell
      title="Hackathon Voting Arena"
      subtitle="Compare two projects at a time. Pick the stronger one and keep going until all matchups are complete."
    >
      {currentPair && leftProject && rightProject ? (
        <VoteDuel left={leftProject} right={rightProject} onVote={handleVote} progress={progress} />
      ) : (
        <section className="rounded-xl border border-emerald-300 bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">All comparisons completed.</p>
          <p className="text-sm text-emerald-700">You voted through every available matchup.</p>
          <Link href="/done" className="mt-3 inline-block text-sm font-semibold text-emerald-800">
            Go to done page →
          </Link>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/vote" className="rounded-lg border border-slate-300 px-4 py-2 text-sm no-underline">
          Continue voting flow
        </Link>
        <Link href="/my" className="rounded-lg border border-slate-300 px-4 py-2 text-sm no-underline">
          Manage my project
        </Link>
      </div>
    </AppShell>
  );
}
