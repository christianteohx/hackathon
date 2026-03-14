import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <p className="text-slate-600">Placeholder page for leaderboard results.</p>
      <Link href="/">Back home</Link>
    </main>
  );
}
