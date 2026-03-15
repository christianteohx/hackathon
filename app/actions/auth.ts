"use server";
import { revalidatePath } from "next/cache";
import { getAuthCallbackUrl, getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validateDisplayName, validateEmail } from "@/lib/validations";
import type { ActionResult } from "@/types/project";
import { updateProfileForUser } from "@/lib/projects";

export async function loginAction(emailInput: string): Promise<ActionResult> {
  try {
    const email = validateEmail(emailInput);
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });
    if (error) {
      throw new Error(error.message);
    }
    return { message: "Check your email for the magic link.", ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to send the magic link.",
      ok: false,
    };
  }
}

export async function loginWithPasswordAction(
  emailInput: string,
  password: string
): Promise<ActionResult> {
  try {
    const email = validateEmail(emailInput);
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return {
      ok: true,
      user: {
        id: data.user.id,
        email: data.user.email || "",
        name: data.user.user_metadata?.name || "",
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to sign in.",
      ok: false,
    };
  }
}

export async function registerAction(
  emailInput: string,
  password: string,
  nameInput: string
): Promise<ActionResult> {
  try {
    const email = validateEmail(emailInput);
    const displayName = validateDisplayName(nameInput);
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: displayName,
        },
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // If email confirmation is required, return success message
    if (data.user && !data.session) {
      return {
        ok: true,
        message: "Account created! Please check your email to confirm your address.",
        user: {
          id: data.user.id,
          email: data.user.email || "",
          name: displayName,
        },
      };
    }

    // If session is created immediately (no email confirmation required)
    if (data.session && data.user) {
      return {
        ok: true,
        user: {
          id: data.user.id,
          email: data.user.email || "",
          name: displayName,
        },
      };
    }

    return {
      error: "Unable to create account.",
      ok: false,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create account.",
      ok: false,
    };
  }
}

export async function updateProfileAction(
  displayNameInput: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to update your profile.");
    }
    const displayName = validateDisplayName(displayNameInput);
    const supabase = createServerSupabaseClient();
    await updateProfileForUser(supabase, user.id, displayName);
    revalidatePath("/my");
    return { ok: true, redirectTo: "/my?success=profile-saved" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save your profile.",
      ok: false,
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return { ok: true, redirectTo: "/login" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to log out.",
      ok: false,
    };
  }
}
