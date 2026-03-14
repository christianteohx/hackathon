"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { ActionResult } from "@/types/project";
import { FlashMessage } from "./flash-message";

type JoinProjectFormProps = {
  action: (joinCode: string) => Promise<ActionResult>;
};

export function JoinProjectForm({ action }: JoinProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const joinCode = String(formData.get("joinCode") ?? "");

    setError(null);

    startTransition(async () => {
      const result = await action(joinCode);

      if (!result.ok) {
        setError(result.error ?? "Unable to join the project.");
        return;
      }

      router.push(result.redirectTo ?? "/my");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="joinCode" className="block text-sm font-medium">
          Join code
        </label>
        <input
          id="joinCode"
          name="joinCode"
          type="text"
          required
          maxLength={6}
          disabled={isPending}
          className="w-full rounded border border-slate-300 px-3 py-2 uppercase"
          placeholder="A7KQ92"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded border border-slate-300 px-4 py-2 disabled:opacity-60"
      >
        {isPending ? "Joining..." : "Join project"}
      </button>

      <FlashMessage error={error} />
    </form>
  );
}
