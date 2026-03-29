"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubmitPage() {
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Validate project name
    const trimmedProjectName = projectName.trim();
    if (trimmedProjectName.length < 3) {
      alert("Project name must be at least 3 characters");
      setSubmitting(false);
      return;
    }
    if (trimmedProjectName.length > 50) {
      alert("Project name must be under 50 characters");
      setSubmitting(false);
      return;
    }

    // Validate description
    if (description.length < 20) {
      alert("Please write a description of at least 20 characters");
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("projects")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert([{
          team_name: teamName,
          project_name: projectName,
          tagline,
          description,
          demo_url: demoUrl || null,
          github_url: githubUrl || null,
        }] as any)
        .select()
        .single();

      if (error) {
        alert("Error submitting: " + error.message);
      } else {
        setSubmitted(true);
      }
    } catch {
      alert("Submitting... (database may not be set up yet)");
    }

    setSubmitting(false);
  }

  if (submitted) {
    return (
      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Project Submitted!</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>Your project is now on the leaderboard.</p>
        <a href="/vote" style={{ color: "#3b82f6", textDecoration: "underline" }}>Go vote for other projects →</a>
      </main>
    );
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
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
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
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
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
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
          <div style={{ fontSize: "0.75rem", color: "#999", textAlign: "right" }}>
            {tagline.length}/100
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your project in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
          <div style={{ fontSize: "0.75rem", color: "#999", textAlign: "right" }}>
            {description.length}/500
          </div>
        </div>
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium text-slate-700 mb-1">
            Demo URL <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="demoUrl"
            type="url"
            placeholder="https://your-demo.com"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
        </div>
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 mb-1">
            GitHub URL <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/your/project"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-purple-700 text-white px-6 py-2 font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Project"}
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
