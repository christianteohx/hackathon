'use client';

import { useState } from 'react';

type PitchResult = {
  oneLinePitch: string;
  audiencePitch: string;
  judgePitch: string;
};

type Props = {
  projectName: string;
  tagline: string;
  description: string;
  onApplyOneLine?: (pitch: string) => void;
  onApplyTagline?: (tagline: string) => void;
};

export function AIPitchPanel({ projectName, tagline, description, onApplyOneLine, onApplyTagline }: Props) {
  const [pitches, setPitches] = useState<PitchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleGenerate() {
    if (!projectName.trim() || !tagline.trim() || !description.trim()) {
      setError('Fill in project name, tagline, and description first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, tagline, description }),
      });
      const data = await res.json();
      if (data.success) {
        setPitches(data.data);
        setExpanded(true);
      } else {
        setError(data.error || 'Failed to generate pitches.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const canGenerate = projectName.trim().length >= 2 && tagline.trim().length >= 5 && description.trim().length >= 10;

  return (
    <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[var(--primary)]/10 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base">✨</span>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">AI Pitch Generator</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {pitches ? 'Regenerate or copy your AI pitches' : 'Generate one-line, audience & judge pitches'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pitches && (
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
              Generated
            </span>
          )}
          <svg
            className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          {!pitches && !loading && !error && (
            <div className="text-center py-3">
              <p className="text-xs text-[var(--muted-foreground)] mb-3">
                Fill in your project details above, then generate AI-powered pitches.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate || loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <span>✨</span>
                Generate Pitches
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-[var(--muted-foreground)]">Generating pitches with AI...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-2">
              <p className="text-xs text-[var(--error)] mb-2">{error}</p>
              <button type="button" onClick={handleGenerate} className="text-xs text-[var(--primary)] underline hover:no-underline">
                Try again
              </button>
            </div>
          )}

          {pitches && (
            <div className="space-y-3 pt-2">
              {/* One-liner */}
              <div className="rounded-lg bg-white border border-[var(--border)] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                    One-liner
                  </p>
                  <div className="flex items-center gap-1.5">
                    {onApplyTagline && (
                      <button
                        type="button"
                        onClick={() => { onApplyTagline(pitches.oneLinePitch); setCopied('apply-tagline'); setTimeout(() => setCopied(null), 1500); }}
                        className="text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                      >
                        {copied === 'apply-tagline' ? '✓ Applied' : 'Use as tagline'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => copyText(pitches.oneLinePitch, 'one-liner')}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 transition-colors"
                    >
                      {copied === 'one-liner' ? '✓' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-[var(--foreground)] leading-snug">
                  &ldquo;{pitches.oneLinePitch}&rdquo;
                </p>
              </div>

              {/* Audience pitch */}
              <div className="rounded-lg bg-white border border-[var(--border)] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                    Audience Pitch
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(pitches.audiencePitch, 'audience')}
                    className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 transition-colors"
                  >
                    {copied === 'audience' ? '✓' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{pitches.audiencePitch}</p>
              </div>

              {/* Judge pitch */}
              <div className="rounded-lg bg-white border border-[var(--border)] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                    Judge Pitch
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(pitches.judgePitch, 'judge')}
                    className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 transition-colors"
                  >
                    {copied === 'judge' ? '✓' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{pitches.judgePitch}</p>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
              >
                🔄 Regenerate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
