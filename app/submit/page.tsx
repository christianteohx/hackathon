"use client";

import Link from "next/link";

export default function SubmitPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Submit clicked");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold mb-6">Submit Your Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-slate-700 mb-1">
            Team Name
          </label>
          <input
            id="teamName"
            type="text"
            placeholder="The Innovators"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
        </div>
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-1">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="Awesome App"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
        </div>
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-slate-700 mb-1">
            Tagline
          </label>
          <input
            id="tagline"
            type="text"
            placeholder="One-line description of your project"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your project in detail..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-purple-700 text-white px-6 py-2 font-semibold hover:bg-purple-800 transition-colors"
        >
          Submit Project
        </button>
      </form>
      <div className="mt-6">
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
