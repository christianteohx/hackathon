"use client";

import { FormEvent, useEffect, useState } from "react";

type Mode = "login" | "register";

export function AuthModal({
  isOpen,
  actionLabel,
  onClose,
  onLogin
}: {
  isOpen: boolean;
  actionLabel: string;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setMode("login");
      setName("");
      setEmail("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    onLogin(name, email);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Sign in to continue</h2>
            <p className="mt-1 text-sm text-slate-600">Please sign in or register to {actionLabel}.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-4 inline-flex rounded-lg border border-slate-300 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-md px-3 py-1.5 ${mode === "login" ? "bg-slate-900 text-white" : "text-slate-700"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-md px-3 py-1.5 ${mode === "register" ? "bg-slate-900 text-white" : "text-slate-700"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-800">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@school.edu"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-800">
              {mode === "login" ? "Display name (optional)" : "Choose a display name (optional)"}
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Alex"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <button type="submit" className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
