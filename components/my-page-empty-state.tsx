import Link from "next/link";
import type { UserProfile } from "@/types/project";
import { LogoutButton } from "./logout-button";

type MyPageEmptyStateProps = {
  logoutAction: () => Promise<{ error?: string; ok: boolean; redirectTo?: string }>;
  profile: UserProfile;
};

export function MyPageEmptyState({
  logoutAction,
  profile
}: MyPageEmptyStateProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">You are not on a project yet</h2>
        <p className="text-slate-600">
          Signed in as {profile.displayName ?? profile.email}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/project/create"
          className="rounded border border-slate-300 px-4 py-2"
        >
          Create Project
        </Link>
        <Link
          href="/project/join"
          className="rounded border border-slate-300 px-4 py-2"
        >
          Join Project
        </Link>
        <Link
          href="/vote"
          className="rounded border border-slate-300 px-4 py-2"
        >
          Go to Voting
        </Link>
      </div>

      <LogoutButton action={logoutAction} />
    </section>
  );
}
