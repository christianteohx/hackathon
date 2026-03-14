import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { generateJoinCode } from "@/lib/join-code";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  AuthUser,
  MyContext,
  Project,
  ProjectInput,
  ProjectMembership,
  ProjectMembershipRole,
  UserProfile
} from "@/types/project";

type ProjectMembershipRow =
  Database["public"]["Tables"]["project_members"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type UserProfileRow = Database["public"]["Tables"]["users"]["Row"];
type TypedSupabaseClient = SupabaseClient<Database>;

function mapAuthUser(user: User, profile: UserProfile): AuthUser {
  return {
    email: user.email ?? profile.email,
    id: user.id
  };
}

function mapUserProfile(row: UserProfileRow): UserProfile {
  return {
    createdAt: row.created_at,
    displayName: row.display_name,
    email: row.email,
    id: row.id,
    updatedAt: row.updated_at
  };
}

function mapProjectMembership(row: ProjectMembershipRow): ProjectMembership {
  return {
    joinedAt: row.joined_at,
    projectId: row.project_id,
    role: row.role as ProjectMembershipRole,
    userId: row.user_id
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    createdAt: row.created_at,
    createdByUserId: row.created_by_user_id,
    demoUrl: row.demo_url,
    description: row.description,
    githubUrl: row.github_url,
    id: row.id,
    joinCode: row.join_code,
    name: row.name,
    tagline: row.tagline,
    updatedAt: row.updated_at
  };
}

function isUniqueViolation(error: { code?: string } | null) {
  return error?.code === "23505";
}

export async function ensureUserProfile(
  supabase: TypedSupabaseClient,
  user: User
) {
  const email = user.email;

  if (!email) {
    throw new Error("Authenticated user is missing an email address.");
  }

  const {
    data: existingProfile,
    error: existingProfileError
  } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfileError) {
    throw new Error(existingProfileError.message);
  }

  const timestamp = new Date().toISOString();

  if (!existingProfile) {
    const {
      data: createdProfile,
      error: createProfileError
    } = await supabase
      .from("users")
      .insert({
        created_at: timestamp,
        display_name: null,
        email,
        id: user.id,
        updated_at: timestamp
      })
      .select("*")
      .single();

    if (createProfileError) {
      throw new Error(createProfileError.message);
    }

    return mapUserProfile(createdProfile);
  }

  if (existingProfile.email !== email) {
    const {
      data: updatedProfile,
      error: updateProfileError
    } = await supabase
      .from("users")
      .update({
        email,
        updated_at: timestamp
      })
      .eq("id", user.id)
      .select("*")
      .single();

    if (updateProfileError) {
      throw new Error(updateProfileError.message);
    }

    return mapUserProfile(updatedProfile);
  }

  return mapUserProfile(existingProfile);
}

export async function getMembershipForUser(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("project_members")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getProjectForMembership(
  supabase: TypedSupabaseClient,
  membership: ProjectMembershipRow
) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", membership.project_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function getProfileCompletionError(profile: UserProfile) {
  if (!profile.displayName) {
    throw new Error("Complete your profile before creating or joining a project.");
  }
}

export async function getMyContext(): Promise<MyContext | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = createServerSupabaseClient();
  const profile = await ensureUserProfile(supabase, user);
  const membershipRow = await getMembershipForUser(supabase, user.id);

  if (!membershipRow) {
    return {
      authUser: mapAuthUser(user, profile),
      membership: null,
      profile,
      project: null
    };
  }

  const projectRow = await getProjectForMembership(supabase, membershipRow);

  return {
    authUser: mapAuthUser(user, profile),
    membership: mapProjectMembership(membershipRow),
    profile,
    project: mapProject(projectRow)
  };
}

export async function requireMyContext() {
  const context = await getMyContext();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function updateProfileForUser(
  supabase: TypedSupabaseClient,
  userId: string,
  displayName: string
) {
  const { data, error } = await supabase
    .from("users")
    .update({
      display_name: displayName,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapUserProfile(data);
}

export async function createProjectForUser(
  supabase: TypedSupabaseClient,
  user: User,
  input: ProjectInput
) {
  const profile = await ensureUserProfile(supabase, user);
  getProfileCompletionError(profile);

  const existingMembership = await getMembershipForUser(supabase, user.id);

  if (existingMembership) {
    throw new Error("You are already on a project.");
  }

  let attempts = 0;

  while (attempts < 10) {
    attempts += 1;

    const projectId = crypto.randomUUID();
    const joinCode = generateJoinCode();
    const timestamp = new Date().toISOString();

    const { error: createProjectError } = await supabase.from("projects").insert(
      {
        created_at: timestamp,
        created_by_user_id: user.id,
        demo_url: input.demoUrl,
        description: input.description,
        github_url: input.githubUrl,
        id: projectId,
        join_code: joinCode,
        name: input.name,
        tagline: input.tagline,
        updated_at: timestamp
      }
    );

    if (createProjectError) {
      if (isUniqueViolation(createProjectError)) {
        continue;
      }

      throw new Error(createProjectError.message);
    }

    const { error: createMembershipError } = await supabase
      .from("project_members")
      .insert({
        joined_at: timestamp,
        project_id: projectId,
        role: "owner",
        user_id: user.id
      });

    if (createMembershipError) {
      await supabase.from("projects").delete().eq("id", projectId);
      throw new Error(createMembershipError.message);
    }

    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError) {
      throw new Error(projectError.message);
    }

    return mapProject(projectRow);
  }

  throw new Error("Failed to generate a unique join code.");
}

export async function joinProjectByCodeForUser(
  supabase: TypedSupabaseClient,
  user: User,
  joinCode: string
) {
  const profile = await ensureUserProfile(supabase, user);
  getProfileCompletionError(profile);

  const existingMembership = await getMembershipForUser(supabase, user.id);

  if (existingMembership) {
    throw new Error("You are already on a project.");
  }

  const { data: projectId, error: projectIdError } = await supabase.rpc(
    "find_project_by_join_code",
    {
      input_join_code: joinCode
    }
  );

  if (projectIdError) {
    throw new Error(projectIdError.message);
  }

  if (!projectId) {
    throw new Error("Invalid join code.");
  }

  const { error: joinProjectError } = await supabase
    .from("project_members")
    .insert({
      joined_at: new Date().toISOString(),
      project_id: projectId,
      role: "member",
      user_id: user.id
    });

  if (joinProjectError) {
    if (isUniqueViolation(joinProjectError)) {
      throw new Error("You are already on a project.");
    }

    throw new Error(joinProjectError.message);
  }

  const { data: projectRow, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError) {
    throw new Error(projectError.message);
  }

  return mapProject(projectRow);
}

export async function updateProjectForUser(
  supabase: TypedSupabaseClient,
  user: User,
  input: ProjectInput
) {
  const membershipRow = await getMembershipForUser(supabase, user.id);

  if (!membershipRow) {
    throw new Error("You are not on a project.");
  }

  if (membershipRow.role !== "owner") {
    throw new Error("Only the project owner can update project details.");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      demo_url: input.demoUrl,
      description: input.description,
      github_url: input.githubUrl,
      name: input.name,
      tagline: input.tagline,
      updated_at: new Date().toISOString()
    })
    .eq("id", membershipRow.project_id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProject(data);
}
