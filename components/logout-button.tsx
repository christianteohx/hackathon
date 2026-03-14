"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/types/project";

type LogoutButtonProps = {
  action: () => Promise<ActionResult>;
};

export function LogoutButton({ action }: LogoutButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);

    startTransition(async () => {
      const result = await action();

      if (!result.ok) {
        setError(result.error ?? "Unable to log out.");
        return;
      }

      router.push(result.redirectTo ?? "/login");
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
      >
        {isPending ? "Logging out..." : "Log out"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
