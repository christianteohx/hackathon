"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AppShell } from "@/components/AppShell";
import { generateJoinCode } from "@/lib/join-code";

function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return `${diffDays} days ago`;
}

function ProjectCardPreview({
  name,
  tagline,
  description,
  teamName,
  demoUrl,
  githubUrl,
  tags,
}: {
  name: string;
  tagline: string;
  description: string;
  teamName: string;
  demoUrl: string;
  githubUrl: string;
  tags: string;
}) {
  const parsedTags = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <article className="h-full rounded-xl border border-[var(--border)] bg-white p-5 flex flex-col transition-all duration-200 card-hover shadow-sm">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {teamName ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] truncate">
            {teamName}
          </p>
        ) : (
          <span />
        )}
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
          Submitted just now
        </span>
      </div>
      <h3
        className="mt-3 text-xl font-bold text-[var(--foreground)] leading-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {name}
      </h3>
      {tagline && (
        <p className="mt-2 text-sm font-semibold text-[var(--primary)] leading-snug">
          {tagline}
        </p>
      )}
      {description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
      )}
      {parsedTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {parsedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SubmitPage() {
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [hackathonContact, setHackathonContact] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

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
      .select("id, contact_email")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!hackathon) {
      setError("No active hackathon found. Please contact an organizer.");
      setSubmitting(false);
      return;
    }

    if ((hackathon as { contact_email?: string }).contact_email) {
      setHackathonContact((hackathon as { contact_email: string }).contact_email);
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
        tags: tags.trim(),
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
          {hackathonContact && (
            <p className="text-sm text-[var(--muted-foreground)] mb-4 max-w-md mx-auto">
              Questions? Contact the organizers at{" "}
              <a href={`mailto:${hackathonContact}`} className="text-[var(--primary)] underline">
                {hackathonContact}
              </a>
            </p>
          )}
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

      {/* Form / Preview Tab */}
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "form"
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
          }`}
        >
          📝 Form
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "preview"
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
          }`}
        >
          👁️ Preview
        </button>
      </div>

      {/* Login warning */}
      {!session && (
        <div className="rounded-xl border border-[var(--warning)]/20 bg-[var(--warning)]/5 p-4 text-[var(--warning)] text-sm mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          You should <a href="/login" className="underline font-semibold">log in</a> before submitting.
        </div>
      )}

      {activeTab === "form" ? (
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

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tags" className="text-sm font-semibold text-[var(--foreground)]">
            Tags <span className="text-[var(--muted-foreground)] font-normal">(optional, comma-separated)</span>
          </label>
          <input
            id="tags"
            type="text"
            placeholder="ai, web3, mobile, hardware"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <div className="text-xs text-[var(--muted-foreground)]">Separate tags with commas (e.g. "ai, web3, mobile")</div>
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
      ) : (
        /* Preview Tab */
        <div className="max-w-xl">
          {projectName.trim() || tagline.trim() || description.trim() || teamName.trim() ? (
            <div className="animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
                Live Preview
              </p>
              <ProjectCardPreview
                name={projectName || "Your Project Name"}
                tagline={tagline}
                description={description}
                teamName={teamName}
                demoUrl={demoUrl}
                githubUrl={githubUrl}
                tags={tags}
              />
              <p className="mt-4 text-xs text-center text-[var(--muted-foreground)]">
                This is how your project will appear on the leaderboard
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--border)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-[var(--foreground)] mb-2">Nothing to preview yet</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Fill in some details in the <button type="button" onClick={() => setActiveTab("form")} className="text-[var(--primary)] underline font-semibold">Form tab</button> to see a live preview.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ProjectCardPreview component */}
      {activeTab === "preview" && <span />}

    </AppShell>
  );
}
