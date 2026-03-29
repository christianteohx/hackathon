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

    // Fetch active hackathon
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
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            You're on the leaderboard!
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Share your project's join code with teammates so they can edit it.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/vote"
              style={{ padding: "10px 20px", borderRadius: "8px", background: "#3b82f6", color: "white", textDecoration: "none", fontWeight: "600" }}
            >
              🗳️ Go vote for other projects
            </a>
            <a
              href="/"
              style={{ padding: "10px 20px", borderRadius: "8px", background: "#f1f5f9", color: "#333", textDecoration: "none", fontWeight: "600" }}
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
        <div style={{
          background: "#fee2e2",
          border: "1px solid #ef4444",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          color: "#dc2626",
          marginBottom: "1rem",
          fontSize: "0.875rem",
        }}>
          ⚠️ {error}
        </div>
      )}

      {!session && (
        <div style={{
          background: "#fef3c7",
          border: "1px solid #f59e0b",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          color: "#92400e",
          marginBottom: "1rem",
          fontSize: "0.875rem",
        }}>
          ⚠️ You should <a href="/login" style={{ color: "#3b82f6", textDecoration: "underline" }}>log in</a> before submitting.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "640px" }}>
        <div>
          <label htmlFor="teamName" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
            Team Name
          </label>
          <input
            id="teamName"
            type="text"
            placeholder="The Innovators"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div>
          <label htmlFor="projectName" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
            Project Name <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="Awesome App"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div>
          <label htmlFor="tagline" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
            Tagline <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="tagline"
            type="text"
            placeholder="One-line description of your project"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "right" }}>
            {tagline.length}/100
          </div>
        </div>

        <div>
          <label htmlFor="description" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
            Description <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your project in detail. What does it do? What tech stack? What problem does it solve?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "right" }}>
            {description.length}/500
          </div>
        </div>

        <div>
          <label htmlFor="demoUrl" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
            Demo URL <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional)</span>
          </label>
          <input
            id="demoUrl"
            type="url"
            placeholder="https://your-demo.com"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div>
          <label htmlFor="githubUrl" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
            GitHub URL <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional)</span>
          </label>
          <input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/your/project"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: "0.5rem",
            borderRadius: "8px",
            background: submitting ? "#9ca3af" : "#7c3aed",
            color: "white",
            padding: "10px 24px",
            fontWeight: "600",
            fontSize: "0.875rem",
            border: "none",
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {submitting ? "Submitting..." : "🚀 Submit Project"}
        </button>

        <Link href="/" style={{ fontSize: "0.875rem", color: "#6b7280", textDecoration: "underline" }}>
          ← Back home
        </Link>
      </form>
    </AppShell>
  );
}
