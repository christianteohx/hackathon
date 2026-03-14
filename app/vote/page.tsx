"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { VoteDuel } from "@/components/VoteDuel";
import { useAppState } from "@/lib/app-state";

export default function VotePage() {
  const { currentPair, projects, castVote, voteHistory, votePairs, isAuthed, user, openAuthModal, requireAuth } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (!currentPair) {
      router.replace("/done");
    }
  }, [currentPair, router]);

  if (!currentPair) {
    return null;
  }

  const leftProject = projects.find((project) => project.id === currentPair.leftProjectId);
  const rightProject = projects.find((project) => project.id === currentPair.rightProjectId);

  if (!leftProject || !rightProject) {
    return (
      <AppShell title="Vote" subtitle="Project pair unavailable.">
        <p className="text-sm text-rose-700">Unable to load the current vote pair.</p>
      </AppShell>
    );
  }

  const progress = `${voteHistory.length}/${votePairs.length} matchups voted`;

  function handleVote(winnerId: string) {
    const hasValidAuth = Boolean(isAuthed && user?.email);
    if (!hasValidAuth) {
      openAuthModal("cast a vote");
      return;
    }

    if (!requireAuth("cast a vote")) {
      return;
    }

    castVote(winnerId);

    if (voteHistory.length + 1 >= votePairs.length) {
      router.push("/done");
    }
  }

  return (
    <AppShell title="Voting Flow" subtitle="Record votes and continue until all project matchups are done.">
      <VoteDuel left={leftProject} right={rightProject} onVote={handleVote} progress={progress} />

      <div>
        <Link href="/my" className="text-sm">
          Need to update your project first?
        </Link>
      </div>
    </AppShell>
  );
}
