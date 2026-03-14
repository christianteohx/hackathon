import Link from "next/link";
import { AppNav } from "@/components/app-nav";

export default function VotePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <AppNav current="vote" />
      <h1 className="text-2xl font-semibold">Vote</h1>
      <p className="text-slate-600">
        Voting internals are owned by another developer. This route is kept in
        place so navigation can be integrated now.
      </p>
      <Link href="/my">Back to My Page</Link>
    </main>
  );
}
