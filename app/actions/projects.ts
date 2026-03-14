"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  createProjectForUser,
  joinProjectByCodeForUser,
  updateProjectForUser
} from "@/lib/projects";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  parseProjectInput,
  validateJoinCode,
  validateProjectInput
} from "@/lib/validations";
import type { ActionResult } from "@/types/project";

export async function createProjectAction(
  input: FormData | Record<string, string | null>
): Promise<ActionResult> {
  try {
    const formData =
      input instanceof FormData ? input : new FormData();

    if (!(input instanceof FormData)) {
      Object.entries(input).forEach(([key, value]) => {
        if (value !== null) {
          formData.set(key, value);
        }
      });
    }

    const projectInput = validateProjectInput(parseProjectInput(formData));
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("You must be logged in to create a project.");
    }

    const supabase = createServerSupabaseClient();

    await createProjectForUser(supabase, user, projectInput);
    revalidatePath("/my");

    return {
      ok: true,
      redirectTo: "/my?success=project-created"
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to create the project.",
      ok: false
    };
  }
}

export async function joinProjectByCodeAction(
  joinCodeInput: string
): Promise<ActionResult> {
  try {
    const joinCode = validateJoinCode(joinCodeInput);
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("You must be logged in to join a project.");
    }

    const supabase = createServerSupabaseClient();

    await joinProjectByCodeForUser(supabase, user, joinCode);
    revalidatePath("/my");

    return {
      ok: true,
      redirectTo: "/my?success=project-joined"
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to join the project.",
      ok: false
    };
  }
}

export async function updateProjectAction(
  input: FormData | Record<string, string | null>
): Promise<ActionResult> {
  try {
    const formData =
      input instanceof FormData ? input : new FormData();

    if (!(input instanceof FormData)) {
      Object.entries(input).forEach(([key, value]) => {
        if (value !== null) {
          formData.set(key, value);
        }
      });
    }

    const projectInput = validateProjectInput(parseProjectInput(formData));
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("You must be logged in to update a project.");
    }

    const supabase = createServerSupabaseClient();

    await updateProjectForUser(supabase, user, projectInput);
    revalidatePath("/my");

    return {
      ok: true,
      redirectTo: "/my?success=project-saved"
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to save the project.",
      ok: false
    };
  }
}
