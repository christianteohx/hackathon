"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { ActionResult } from "@/types/project";
import { FlashMessage } from "./flash-message";

type ProfileFormProps = {
  action: (displayName: string) => Promise<ActionResult>;
};

export function ProfileForm({ action }: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const displayName = String(formData.get("displayName") ?? "");

    setError(null);

    startTransition(async () => {
      const result = await action(displayName);

      if (!result.ok) {
        setError(result.error ?? "Unable to save your profile.");
        return;
      }

      router.push(result.redirectTo ?? "/my");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="displayName" className="block text-sm font-medium">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          maxLength={50}
          disabled={isPending}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Your name"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded border border-slate-300 px-4 py-2 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>

      <FlashMessage error={error} />
    </form>
  );
}
