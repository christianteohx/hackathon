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
        <div className="text-center py-12 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 
            className="text-3xl font-bold text-[var(--foreground)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            You're on the leaderboard!
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
            Share your project's join code with teammates so they can edit it.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/vote"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              🗳️ Go vote for other projects
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--muted)] transition-colors"
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
      {/* Error alert */}
      {error && (
        <div className="rounded-xl border border-[var(--error)]/20 bg-[var(--error)]/5 p-4 text-[var(--error)] text-sm mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Login warning */}
      {!session && (
        <div className="rounded-xl border border-[var(--warning)]/20 bg-[var(--warning)]/5 p-4 text-[var(--warning)] text-sm mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          You should <a href="/login" className="underline font-semibold">log in</a> before submitting.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-6">
        {/* Team Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="teamName" className="text-sm font-semibold text-[var(--foreground)]">
            Team Name
          </label>
          <input
            id="teamName"
            type="text"
            placeholder="The Innovators"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Project Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="projectName" className="text-sm font-semibold text-[var(--foreground)]">
            Project Name <span className="text-[var(--error)]">*</span>
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="Awesome App"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Tagline */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tagline" className="text-sm font-semibold text-[var(--foreground)]">
            Tagline <span className="text-[var(--error)]">*</span>
          </label>
          <input
            id="tagline"
            type="text"
            placeholder="One-line description of your project"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <div className="text-xs text-[var(--muted-foreground)] text-right">{tagline.length}/100</div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-semibold text-[var(--foreground)]">
            Description <span className="text-[var(--error)]">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your project. What does it do? What tech stack? What problem does it solve?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
            className="w-full rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none"
          />
          <div className="text-xs text-[var(--muted-foreground)] text-right">{description.length}/500</div>
        </div>

        {/* Demo URL */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="demoUrl" className="text-sm font-semibold text-[var(--foreground)]">
            Demo URL <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <input
            id="demoUrl"
            type="url"
            placeholder="https://your-demo.com"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className="w-full rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* GitHub URL */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="githubUrl" className="text-sm font-semibold text-[var(--foreground)]">
            GitHub URL <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/your/project"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-xl bg-[var(--primary)] text-white px-6 py-4 font-semibold text-base hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Project
            </>
          )}
        </button>

        <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] text-center transition-colors">
          ← Back home
        </Link>
      </form>
    </AppShell>
  );
}
