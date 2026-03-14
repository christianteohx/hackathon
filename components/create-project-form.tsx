"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { ActionResult } from "@/types/project";
import { FlashMessage } from "./flash-message";

type CreateProjectFormProps = {
  action: (input: {
    demoUrl: string | null;
    description: string;
    githubUrl: string | null;
    name: string;
    tagline: string;
  }) => Promise<ActionResult>;
};

export function CreateProjectForm({ action }: CreateProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setError(null);

    startTransition(async () => {
      const result = await action({
        demoUrl: String(formData.get("demoUrl") ?? "").trim() || null,
        description: String(formData.get("description") ?? ""),
        githubUrl: String(formData.get("githubUrl") ?? "").trim() || null,
        name: String(formData.get("name") ?? ""),
        tagline: String(formData.get("tagline") ?? "")
      });

      if (!result.ok) {
        setError(result.error ?? "Unable to create the project.");
        return;
      }

      router.push(result.redirectTo ?? "/my");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Project name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
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
          disabled={isPending}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="https://..."
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
          disabled={isPending}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="https://github.com/..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded border border-slate-300 px-4 py-2 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create project"}
      </button>

      <FlashMessage error={error} />
    </form>
  );
}
