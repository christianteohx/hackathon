"use client";

import { useAppState } from "@/lib/app-state";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthed } = useAppState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthed) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthed, pathname, router]);

  if (!isAuthed) {
    return <p className="text-sm text-slate-600">Redirecting to login...</p>;
  }

  return <>{children}</>;
}
