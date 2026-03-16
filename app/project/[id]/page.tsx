"use client";

import { use, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Project } from "@/types/project";

interface PitchData {
  oneLinePitch: string;
  audiencePitch: string;
  judgePitch: string;
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [pitches, setPitches] = useState<PitchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, fetch the project from Supabase
  // For now, we'll use mock data or fetch from API
  useState(() => {
    // Fetch project data
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
        setLoading(false);
      });
  });

  const handleGeneratePitches = async () => {
    if (!project) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: project.name,
          tagline: project.tagline,
          description: project.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate pitches");
      }

      const result = await response.json();
      setPitches(result.data);
    } catch (err) {
      console.error("Error generating pitches:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Loading..." subtitle="">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading project...</div>
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell title="Project Not Found" subtitle="">
        <div className="text-center py-12 text-slate-600">
          Project not found
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={project.name} subtitle={project.tagline}>
      <div className="space-y-6">
        {/* Project Details */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Project Details</h2>
          <div className="mt-4 space-y-3">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Description</h3>
              <p className="mt-1 text-slate-900">{project.description}</p>
            </div>
            {project.demoUrl && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Demo</h3>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-800"
                >
                  {project.demoUrl}
                </a>
              </div>
            )}
            {project.githubUrl && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">GitHub</h3>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-800"
                >
                  {project.githubUrl}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* AI Pitch Generator */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI-Generated Pitches</h2>
              <p className="text-sm text-slate-600">
                Generate compelling pitches using AI
              </p>
            </div>
            <button
              onClick={handleGeneratePitches}
              disabled={generating || !!pitches}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              {generating ? "Generating..." : pitches ? "Generated" : "Generate Pitches"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {pitches && (
            <div className="mt-6 space-y-4">
              {/* One-Line Pitch */}
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <h3 className="text-sm font-semibold text-purple-900">
                  One-Line Pitch
                </h3>
                <p className="mt-2 text-purple-900">{pitches.oneLinePitch}</p>
              </div>

              {/* Audience Pitch */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-sm font-semibold text-blue-900">
                  Audience Pitch
                </h3>
                <p className="mt-2 text-blue-900">{pitches.audiencePitch}</p>
              </div>

              {/* Judge Pitch */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-semibold text-amber-900">
                  Judge Pitch
                </h3>
                <p className="mt-2 text-amber-900">{pitches.judgePitch}</p>
              </div>
            </div>
          )}

          {!pitches && !generating && !error && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Click the button above to generate AI-powered pitches for your project.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
