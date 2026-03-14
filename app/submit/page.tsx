import Link from "next/link";

export default function SubmitPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Submit</h1>
      <p className="text-slate-600">Placeholder page for submissions.</p>
      <Link href="/">Back home</Link>
    </main>
  );
}
