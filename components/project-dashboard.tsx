"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type {
  ActionResult,
  AuthUser,
  Project,
  ProjectMembership,
  UserProfile
} from "@/types/project";
import { FlashMessage } from "./flash-message";
import { LogoutButton } from "./logout-button";

type ProjectDashboardProps = {
  authUser: AuthUser;
  logoutAction: () => Promise<ActionResult>;
  membership: ProjectMembership;
  profile: UserProfile;
  project: Project;
  updateProjectAction: (input: {
    demoUrl: string | null;
    description: string;
    githubUrl: string | null;
    name: string;
    tagline: string;
  }) => Promise<ActionResult>;
};

export function ProjectDashboard({
  authUser,
  logoutAction,
  membership,
  profile,
  project,
  updateProjectAction
}: ProjectDashboardProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isOwner = membership.role === "owner";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await updateProjectAction({
        demoUrl: String(formData.get("demoUrl") ?? "").trim() || null,
        description: String(formData.get("description") ?? ""),
        githubUrl: String(formData.get("githubUrl") ?? "").trim() || null,
        name: String(formData.get("name") ?? ""),
        tagline: String(formData.get("tagline") ?? "")
      });

      if (!result.ok) {
        setError(result.error ?? "Unable to save the project.");
        return;
      }

      router.push(result.redirectTo ?? "/my");
      router.refresh();
    });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{project.name}</h2>
          <p className="text-slate-600">
            Signed in as {profile.displayName ?? authUser.email}
          </p>
          <p className="text-sm text-slate-500">Role: {membership.role}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/vote"
            className="rounded border border-slate-300 px-4 py-2"
          >
            Go to Voting
          </Link>
          <LogoutButton action={logoutAction} />
        </div>
      </div>

      <div className="rounded border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-500">Join code</p>
        <p className="mt-1 text-xl font-semibold tracking-[0.2em]">
          {project.joinCode}
        </p>
      </div>

      {isOwner ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Project name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={project.name}
              maxLength={100}
              disabled={isPending}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tagline" className="block text-sm font-medium">
              Tagline
            </label>
            <input
              id="tagline"
              name="tagline"
              type="text"
              defaultValue={project.tagline}
              maxLength={140}
              disabled={isPending}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={project.description}
              maxLength={2000}
              disabled={isPending}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="demoUrl" className="block text-sm font-medium">
              Demo URL
            </label>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              defaultValue={project.demoUrl ?? ""}
              disabled={isPending}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="githubUrl" className="block text-sm font-medium">
              GitHub URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              defaultValue={project.githubUrl ?? ""}
              disabled={isPending}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded border border-slate-300 px-4 py-2 disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save project"}
          </button>

          <FlashMessage error={error} />
        </form>
      ) : (
        <div className="space-y-4 rounded border border-slate-200 p-4">
          <div>
            <h3 className="font-medium">Tagline</h3>
            <p className="text-slate-600">{project.tagline || "No tagline"}</p>
          </div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="whitespace-pre-wrap text-slate-600">
              {project.description || "No description"}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Demo URL</h3>
            <p className="text-slate-600">
              {project.demoUrl ? (
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  {project.demoUrl}
                </a>
              ) : (
                "No demo URL"
              )}
            </p>
          </div>
          <div>
            <h3 className="font-medium">GitHub URL</h3>
            <p className="text-slate-600">
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  {project.githubUrl}
                </a>
              ) : (
                "No GitHub URL"
              )}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
