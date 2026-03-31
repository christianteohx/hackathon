'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { supabase } from '@/lib/supabase';

type Project = {
  id: string;
  name: string;
  tagline: string;
  team_name: string | null;
  elo_rating: number;
};

type JudgeScore = {
  project_id: string;
  innovation: number;
  technical: number;
  presentation: number;
  impact: number;
  feedback: string | null;
  judge_name: string;
};

type ProjectWithScore = Project & {
  avg_innovation: number | null;
  avg_technical: number | null;
  avg_presentation: number | null;
  avg_impact: number | null;
  avg_overall: number | null;
  score_count: number;
};

export default function JudgeListPage() {
  const [projects, setProjects] = useState<ProjectWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, name, tagline, team_name, elo_rating')
          .order('elo_rating', { ascending: false });

        if (projectsError) throw projectsError;

        // Fetch all judge scores
        const { data: scoresData, error: scoresError } = await (supabase as any)
          .from('judge_scores')
          .select('project_id, innovation, technical, presentation, impact, feedback, judge_name');

        if (scoresError) throw scoresError;

        // Aggregate scores by project
        const scoresByProject: Record<string, JudgeScore[]> = {};
        for (const score of scoresData || []) {
          if (!scoresByProject[score.project_id]) {
            scoresByProject[score.project_id] = [];
          }
          scoresByProject[score.project_id].push(score);
        }

        // Compute averages
        const projectsWithScores: ProjectWithScore[] = (projectsData || []).map((project) => {
          const scores = scoresByProject[project.id] || [];
          const count = scores.length;
          const avg = (field: 'innovation' | 'technical' | 'presentation' | 'impact') => {
            if (count === 0) return null;
            return scores.reduce((sum, s) => sum + s[field], 0) / count;
          };
          const avgOverall =
            count === 0
              ? null
              : (scores.reduce((sum, s) => sum + s.innovation + s.technical + s.presentation + s.impact, 0) / count) / 4;

          return {
            ...project,
            avg_innovation: avg('innovation'),
            avg_technical: avg('technical'),
            avg_presentation: avg('presentation'),
            avg_impact: avg('impact'),
            avg_overall: avgOverall,
            score_count: count,
          };
        });

        setProjects(projectsWithScores);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load judge data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function renderScore(value: number | null, suffix = '') {
    if (value === null) return <span className="text-[var(--muted-foreground)]">—</span>;
    return (
      <span className="font-semibold text-[var(--foreground)]">
        {value.toFixed(1)}{suffix}
      </span>
    );
  }

  return (
    <AppShell
      title="⚖️ Judging Panel"
      subtitle="Score all submitted projects on four criteria. See aggregate rankings below."
    >
      {/* Info banner */}
      <div className="mb-8 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">Scoring criteria:</span>{' '}
          Innovation, Technical Quality, Presentation, and Impact — each rated 1–10.
          Scores are averaged across all judges. Click any project to submit your scores.
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[var(--muted-foreground)]">Loading projects...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-[var(--error)]/20 bg-[var(--error)]/5 p-4 text-[var(--error)] text-sm">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
          <p className="text-xl font-semibold text-[var(--foreground)] mb-2">No projects yet</p>
          <p className="text-[var(--muted-foreground)]">Projects will appear here once submitted.</p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <>
          {/* Table header */}
          <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--muted)] text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
              <div className="col-span-4 md:col-span-5">Project</div>
              <div className="col-span-2 text-center hidden md:block">Inno.</div>
              <div className="col-span-2 text-center hidden md:block">Tech.</div>
              <div className="col-span-2 text-center hidden md:block">Pres.</div>
              <div className="col-span-2 text-center hidden md:block">Impact</div>
              <div className="col-span-2 text-center md:col-span-1">Avg</div>
              <div className="col-span-2 text-right">Scores</div>
            </div>

            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/judge/${project.id}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--muted)]/50"
              >
                {/* Project Info */}
                <div className="col-span-4 md:col-span-5 min-w-0">
                  <div
                    className="font-semibold text-[var(--foreground)] truncate"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {project.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {project.team_name && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[var(--muted)] text-[var(--muted-foreground)]">
                        {project.team_name}
                      </span>
                    )}
                    {project.tagline && (
                      <span className="text-xs text-[var(--muted-foreground)] truncate">{project.tagline}</span>
                    )}
                  </div>
                </div>

                {/* Innovation */}
                <div className="hidden md:flex col-span-2 flex-col items-center">
                  {renderScore(project.avg_innovation)}
                </div>

                {/* Technical */}
                <div className="hidden md:flex col-span-2 flex-col items-center">
                  {renderScore(project.avg_technical)}
                </div>

                {/* Presentation */}
                <div className="hidden md:flex col-span-2 flex-col items-center">
                  {renderScore(project.avg_presentation)}
                </div>

                {/* Impact */}
                <div className="hidden md:flex col-span-2 flex-col items-center">
                  {renderScore(project.avg_impact)}
                </div>

                {/* Overall Avg */}
                <div className="col-span-2 md:col-span-1 flex flex-col items-center">
                  {project.avg_overall !== null ? (
                    <span className="text-lg font-bold text-[var(--primary)]">{project.avg_overall.toFixed(1)}</span>
                  ) : (
                    <span className="text-[var(--muted-foreground)]">—</span>
                  )}
                </div>

                {/* Score count */}
                <div className="col-span-2 flex flex-col items-end">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {project.score_count}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {project.score_count === 1 ? 'score' : 'scores'}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-sm text-[var(--muted-foreground)] text-center">
            Click any project to view details and submit your judge scores.
          </p>
        </>
      )}
    </AppShell>
  );
}
