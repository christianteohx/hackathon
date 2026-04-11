'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Participant = {
  id: string;
  user_id: string;
  project_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  user_email?: string;
  user_name?: string;
};

export async function getProjectParticipants(projectId: string): Promise<Participant[]> {
  const { data, error } = await supabaseAdmin
    .from('project_members')
    .select(`
      id,
      user_id,
      project_id,
      role,
      joined_at,
      profiles:user_id (
        name,
        email
      )
    `)
    .eq('project_id', projectId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    user_id: p.user_id,
    project_id: p.project_id,
    role: p.role,
    joined_at: p.joined_at,
    user_email: p.profiles?.email,
    user_name: p.profiles?.name,
  }));
}

export async function addParticipant(
  projectId: string,
  email: string,
  role: 'member' = 'member'
): Promise<{ success: boolean; error?: string; participantId?: string }> {
  // Find user by email
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (profileError || !profile) {
    return { success: false, error: 'No user found with that email. They need to sign up first.' };
  }

  // Check if already a member
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('project_members')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', profile.id)
    .maybeSingle();

  if (existingError) {
    return { success: false, error: 'Failed to check existing membership.' };
  }

  if (existing) {
    return { success: false, error: 'This user is already a participant.' };
  }

  // Add participant
  const { data, error } = await supabaseAdmin
    .from('project_members')
    .insert({
      project_id: projectId,
      user_id: profile.id,
      role,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error adding participant:', error);
    return { success: false, error: `Failed to add participant: ${error.message}` };
  }

  return { success: true, participantId: data.id };
}

export async function removeParticipant(
  memberId: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  // Prevent removing the owner
  const { data: member, error: fetchError } = await supabaseAdmin
    .from('project_members')
    .select('role')
    .eq('id', memberId)
    .eq('project_id', projectId)
    .maybeSingle();

  if (fetchError || !member) {
    return { success: false, error: 'Participant not found.' };
  }

  if (member.role === 'owner') {
    return { success: false, error: 'Cannot remove the project owner.' };
  }

  const { error } = await supabaseAdmin
    .from('project_members')
    .delete()
    .eq('id', memberId)
    .eq('project_id', projectId);

  if (error) {
    return { success: false, error: `Failed to remove participant: ${error.message}` };
  }

  return { success: true };
}

export async function updateParticipantRole(
  memberId: string,
  projectId: string,
  newRole: 'member' | 'owner'
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('project_members')
    .update({ role: newRole })
    .eq('id', memberId)
    .eq('project_id', projectId);

  if (error) {
    return { success: false, error: `Failed to update role: ${error.message}` };
  }

  return { success: true };
}
