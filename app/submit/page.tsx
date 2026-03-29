"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AppShell } from "@/components/AppShell";
import { generateJoinCode } from "@/lib/join-code";

export default function SubmitPage() {
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const trimmedProjectName = projectName.trim();
    if (trimmedProjectName.length < 3) {
      setError("Project name must be at least 3 characters");
      setSubmitting(false);
      return;
    }
    if (trimmedProjectName.length > 50) {
      setError("Project name must be under 50 characters");
      setSubmitting(false);
      return;
    }
    if (description.length < 20) {
      setError("Please write a description of at least 20 characters");
      setSubmitting(false);
      return;
    }
    if (!session?.user?.id) {
      setError("You must be logged in to submit a project");
      setSubmitting(false);
      return;
    }

    const { data: hackathon } = await supabase
      .from("hackathons")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!hackathon) {
      setError("No active hackathon found. Please contact an organizer.");
      setSubmitting(false);
      return;
    }

    const joinCode = generateJoinCode();

    const { error: insertError } = await supabase
      .from("projects")
      .insert({
        name: trimmedProjectName,
        team_name: teamName.trim() || null,
        tagline: tagline.trim(),
        description: description.trim(),
        demo_url: demoUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        join_code: joinCode,
        created_by_user_id: session.user.id,
        hackathon_id: (hackathon as { id: string }).id,
        elo_rating: 1200,
      });

    if (insertError) {
      setError("Error submitting: " + insertError.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <AppShell title="🎉 Project Submitted!" subtitle="Your project is now on the leaderboard">
        <div className="text-center py-12">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">You're on the leaderboard!</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Share your project's join code with teammates so they can edit it.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/vote"
              className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors"
            >
              🗳️ Go vote for other projects
            </a>
            <a
              href="/"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              ← Back home
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="📋 Submit Your Project"
      subtitle="Fill in the details below to add your project to the leaderboard"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {!session && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm mb-6">
          ⚠️ You should <a href="/login" className="text-blue-500 hover:text-blue-600">log in</a> before submitting.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-6">
        {/* Team Name */}
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Team Name
          </label>
          <input
            id="teamName"
            type="text"
            placeholder="The Innovators"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Project Name */}
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="Awesome App"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Tagline */}
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1.5">
            Tagline <span className="text-red-500">*</span>
          </label>
          <input
            id="tagline"
            type="text"
            placeholder="One-line description of your project"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          <div className="text-xs text-gray-400 text-right mt-1">{tagline.length}/100</div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your project. What does it do? What tech stack? What problem does it solve?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
          />
          <div className="text-xs text-gray-400 text-right mt-1">{description.length}/500</div>
        </div>

        {/* Demo URL */}
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            Demo URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="demoUrl"
            type="url"
            placeholder="https://your-demo.com"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            GitHub URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/your/project"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg bg-blue-500 text-white px-6 py-3 font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "🚀 Submit Project"}
        </button>

        <Link href="/" className="text-sm text-gray-500 hover:text-blue-500 text-center">
          ← Back home
        </Link>
      </form>
    </AppShell>
  );
}
