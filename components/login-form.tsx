"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { ActionResult } from "@/types/project";
import { FlashMessage } from "./flash-message";

type LoginFormProps = {
  action: (email: string) => Promise<ActionResult>;
  error?: string | null;
};

export function LoginForm({ action, error }: LoginFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(error ?? null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    setLocalError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await action(email);

      if (!result.ok) {
        setLocalError(result.error ?? "Unable to send the magic link.");
        return;
      }

      if (result.redirectTo) {
        router.push(result.redirectTo);
        router.refresh();
        return;
      }

      setMessage(result.message ?? "Check your email for the magic link.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded border border-slate-300 px-4 py-2 disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send magic link"}
      </button>

      <FlashMessage error={localError} success={message} />
    </form>
  );
}
