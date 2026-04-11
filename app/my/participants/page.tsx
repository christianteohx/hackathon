'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { useAppState } from '@/lib/app-state';
import { getProjectParticipants, addParticipant, removeParticipant, updateParticipantRole, Participant } from '@/app/actions/participants';

export default function ParticipantsPage() {
  const { user, projects } = useAppState();
  const memberProject = projects.find((p) => p.id === user?.projectId);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    if (!memberProject?.id) return;
    setLoading(true);
    const data = await getProjectParticipants(memberProject.id);
    setParticipants(data);
    setLoading(false);
  }, [memberProject?.id]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!memberProject?.id || !inviteEmail.trim()) return;

    setInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    const result = await addParticipant(memberProject.id, inviteEmail.trim());

    if (result.success) {
      setInviteSuccess('Participant added successfully!');
      setInviteEmail('');
      await fetchParticipants();
    } else {
      setInviteError(result.error || 'Failed to add participant.');
    }

    setInviting(false);
  }

  async function handleRemove(memberId: string) {
    if (!memberProject?.id) return;
    if (!confirm('Remove this participant from your team?')) return;

    setRemovingId(memberId);
    setActionError(null);

    const result = await removeParticipant(memberId, memberProject.id);

    if (result.success) {
      await fetchParticipants();
    } else {
      setActionError(result.error || 'Failed to remove participant.');
    }

    setRemovingId(null);
  }

  if (!memberProject) {
    return (
      <AppShell title="👥 Team Management" subtitle="Manage your team members">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)] mb-2">No project found</p>
          <p className="text-[var(--muted-foreground)] mb-6">
            Create or join a project to manage team members.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/my/create" className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              Create Project
            </Link>
            <Link href="/my/join" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--muted)] transition-colors">
              Join Project
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const isOwner = participants.some(
    (p) => p.user_id === user?.id && p.role === 'owner'
  );

  return (
    <AppShell
      title="👥 Team Management"
      subtitle={`Manage members of "${memberProject.name}"`}
    >
      {/* Back link */}
      <Link
        href="/my"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Error/success alerts */}
      {actionError && (
        <div className="rounded-xl border border-[var(--error)]/20 bg-[var(--error)]/5 p-4 text-[var(--error)] text-sm mb-4 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {actionError}
        </div>
      )}

      {/* Invite form */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-6 mb-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Invite Team Member
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Enter the email address of a registered participant to add them to your team.
        </p>

        <form onSubmit={handleInvite} className="flex gap-3 flex-wrap">
          <input
            type="email"
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChange={(e) => {
              setInviteEmail(e.target.value);
              setInviteError(null);
              setInviteSuccess(null);
            }}
            className="flex-1 min-w-0 rounded-lg border border-[var(--input-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inviting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Member
              </>
            )}
          </button>
        </form>

        {inviteError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-[var(--error)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {inviteError}
          </div>
        )}

        {inviteSuccess && (
          <div className="mt-3 flex items-center gap-2 text-sm text-[var(--success)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {inviteSuccess}
          </div>
        )}
      </div>

      {/* Participants list */}
      <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
            Team Members ({participants.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-[var(--muted-foreground)]">
            <div className="w-6 h-6 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-2" />
            Loading members...
          </div>
        ) : participants.length === 0 ? (
          <div className="p-6 text-center text-[var(--muted-foreground)]">
            No team members found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-4 px-6 py-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[var(--primary)]">
                    {(participant.user_name || participant.user_email || '?')[0].toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                    {participant.user_name || 'Unnamed User'}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">
                    {participant.user_email || 'No email'}
                  </p>
                </div>

                {/* Role badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  participant.role === 'owner'
                    ? 'bg-[var(--warning)]/10 text-[var(--warning)]'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                }`}>
                  {participant.role === 'owner' ? '👑 Owner' : 'Member'}
                </span>

                {/* Actions */}
                {isOwner && participant.role !== 'owner' && (
                  <button
                    onClick={() => handleRemove(participant.id)}
                    disabled={removingId === participant.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--error)] hover:bg-[var(--error)]/10 disabled:opacity-50 transition-colors"
                  >
                    {removingId === participant.id ? (
                      <div className="w-3 h-3 border border-[var(--error)]/30 border-t-[var(--error)] rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    Remove
                  </button>
                )}

                {/* Current user indicator */}
                {participant.user_id === user?.id && (
                  <span className="text-xs text-[var(--muted-foreground)]">(you)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 rounded-xl border border-[var(--primary)]/10 bg-[var(--primary)]/5 p-4">
        <p className="text-xs text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">💡 Tip:</span> Team members can edit project details and submit updates. Share your project&apos;s join code (<code className="px-1 py-0.5 bg-[var(--muted)] rounded text-xs">{memberProject.joinCode}</code>) with teammates so they can join directly.
        </p>
      </div>
    </AppShell>
  );
}
