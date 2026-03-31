'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { supabase } from '@/lib/supabase';

type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  team_name: string | null;
  demo_url: string | null;
  github_url: string | null;
  elo_rating: number;
};

type ExistingScore = {
  id: string;
  judge_name: string;
  innovation: number;
  technical: number;
  presentation: number;
  impact: number;
  feedback: string | null;
  created_at: string;
};

function ScoreInput({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[var(--foreground)]">{label}</label>
        <span className="text-lg font-bold text-[var(--primary)]">{value}/10</span>
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
        style={{ accentColor: 'var(--primary)' }}
      />
      <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
        <span>1 — Poor</span>
        <span>10 — Exceptional</span>
      </div>
    </div>
  );
}

function AggregateBar({ label, value }: { label: string; value: number | null }) {
  const pct = value !== null ? (value / 10) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-[var(--foreground)]">{label}</span>
        <span className="text-[var(--muted-foreground)]">
          {value !== null ? value.toFixed(1) : '—'}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function JudgeProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [existingScores, setExistingScores] = useState<ExistingScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [judgeName, setJudgeName] = useState('');
  const [innovation, setInnovation] = useState(5);
  const [technical, setTechnical] = useState(5);
  const [presentation, setPresentation] = useState(5);
  const [impact, setImpact] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Project not found');
        const projectData = await res.json();
        setProject(projectData);

        // Fetch existing scores for this project
        const { data: scoresData, error: scoresError } = await (supabase as any)
          .from('judge_scores')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (scoresError) throw scoresError;
        setExistingScores(scoresData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeName.trim()) {
      alert('Please enter your judge name');
      return;
    }
    if (!project) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/judge-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          judge_name: judgeName.trim(),
          innovation,
          technical,
          presentation,
          impact,
          feedback: feedback.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit score');
      }

      setSubmitted(true);

      // Refresh scores
      const { data: scoresData } = await (supabase as any)
        .from('judge_scores')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      setExistingScores(scoresData || []);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  const avg = (field: 'innovation' | 'technical' | 'presentation' | 'impact') => {
    if (existingScores.length === 0) return null;
    return existingScores.reduce((sum, s) => sum + s[field], 0) / existingScores.length;
  };

  const overallAvg =
    existingScores.length > 0
      ? (avg('innovation')! + avg('technical')! + avg('presentation')! + avg('impact')!) / 4
      : null;

  if (loading) {
    return (
      <AppShell title="Loading..." subtitle="">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading project...</div>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell title="Project Not Found" subtitle="">
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          color: '#dc2626'
        }}>
          {error || 'Project not found'}
        </div>
        <Link href="/judge" style={{ color: '#3b82f6' }}>← Back to Judging Panel</Link>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`⚖️ Judging: ${project.name}`}
      subtitle={project.tagline || undefined}
    >
      {/* Back link */}
      <Link
        href="/judge"
        className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:opacity-80 transition-opacity mb-6"
      >
        ← Back to Judging Panel
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Project Info + Aggregate Scores */}
        <div className="space-y-6">
          {/* Project Card */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-semibold">
                🏆 {Math.round(project.elo_rating)} Elo
              </span>
              {project.team_name && (
                <span className="text-sm px-2.5 py-1 rounded-full bg-[var(--purple)]/10 text-[var(--purple)] font-semibold">
                  by {project.team_name}
                </span>
              )}
            </div>

            <div className="bg-[var(--muted)] rounded-lg p-4 mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Description</h3>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90">
                  🚀 Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90">
                  🐙 GitHub
                </a>
              )}
            </div>
          </div>

          {/* Aggregate Scores */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Aggregate Scores ({existingScores.length} {existingScores.length === 1 ? 'judge' : 'judges'})
            </h3>

            {existingScores.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)] text-center py-6">
                No scores submitted yet. Be the first judge!
              </p>
            ) : (
              <div className="space-y-4">
                <AggregateBar label="Innovation" value={avg('innovation')} />
                <AggregateBar label="Technical" value={avg('technical')} />
                <AggregateBar label="Presentation" value={avg('presentation')} />
                <AggregateBar label="Impact" value={avg('impact')} />

                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--foreground)]">Overall Average</span>
                    <span className="text-2xl font-bold text-[var(--primary)]">
                      {overallAvg !== null ? overallAvg.toFixed(2) : '—'}
                      {overallAvg !== null && <span className="text-sm font-normal text-[var(--muted-foreground)]"> / 10</span>}
                    </span>
                  </div>
                </div>

                {/* Individual scores breakdown */}
                <div className="mt-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Score Breakdown</h4>
                  {existingScores.slice(0, 5).map((score) => (
                    <div key={score.id} className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)] last:border-0">
                      <span className="font-medium text-[var(--foreground)]">{score.judge_name}</span>
                      <span className="text-[var(--muted-foreground)]">
                        Inno: {score.innovation} · Tech: {score.technical} · Pres: {score.presentation} · Impact: {score.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Score Submission Form */}
        <div>
          <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm sticky top-20">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Submit Your Scores
            </h3>

            {submitted && (
              <div className="mb-6 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 p-4">
                <p className="text-sm font-semibold text-[var(--success)]">✓ Score submitted successfully!</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">You can submit another score or update existing ones.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Judge Name */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  Judge Name <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  type="text"
                  value={judgeName}
                  onChange={(e) => setJudgeName(e.target.value)}
                  placeholder="e.g. Alice Smith"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              {/* Score Sliders */}
              <div className="space-y-5">
                <ScoreInput
                  label="Innovation"
                  description="How novel and creative is the project idea?"
                  value={innovation}
                  onChange={setInnovation}
                />
                <ScoreInput
                  label="Technical Quality"
                  description="How well-built and technically sound is the implementation?"
                  value={technical}
                  onChange={setTechnical}
                />
                <ScoreInput
                  label="Presentation"
                  description="How well was the project communicated and demonstrated?"
                  value={presentation}
                  onChange={setPresentation}
                />
                <ScoreInput
                  label="Impact"
                  description="How significant is the project's potential impact?"
                  value={impact}
                  onChange={setImpact}
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  Written Feedback <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts on strengths, weaknesses, and suggestions..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                />
              </div>

              {/* Summary before submit */}
              <div className="rounded-lg bg-[var(--muted)] p-4">
                <p className="text-xs text-[var(--muted-foreground)] mb-2">Your scores for <strong className="text-[var(--foreground)]">{project.name}</strong>:</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Inno', val: innovation },
                    { label: 'Tech', val: technical },
                    { label: 'Pres', val: presentation },
                    { label: 'Impact', val: impact },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-white rounded-lg p-2">
                      <div className="text-lg font-bold text-[var(--primary)]">{val}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[var(--primary)] text-white px-6 py-3 text-base font-bold hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Scores'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
