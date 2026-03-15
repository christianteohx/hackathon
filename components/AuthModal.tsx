"use client";
import { FormEvent, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

type AuthMode = "signin" | "register";

export function AuthModal({
  isOpen,
  actionLabel,
  onClose,
  onLogin,
}: {
  isOpen: boolean;
  actionLabel: string;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
}) {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setError(null);
      setIsLoading(false);
      setSuccess(false);
      setAuthMode("signin");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (authMode === "register") {
        nameInputRef.current?.focus();
      } else {
        emailInputRef.current?.focus();
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted, authMode]);

  if (!isOpen || !mounted) {
    return null;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: authMode,
          email,
          password,
          name: authMode === "register" ? name : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setSuccess(true);

      // Call onLogin callback with user info
      if (onLogin && data.user) {
        onLogin(data.user.name || name, data.user.email);
      }

      // Close modal after a brief delay
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  const toggleMode = () => {
    setAuthMode(authMode === "signin" ? "register" : "signin");
    setError(null);
    setSuccess(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Blurred dark background overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md z-[9998]"
        onClick={onClose}
      />

      {/* Modal content wrapper for proper centering */}
      <div className="relative z-[9999] flex items-center justify-center w-full px-4">
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2
              id="auth-modal-title"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              {success
                ? "Success!"
                : authMode === "signin"
                ? "Sign In"
                : "Create Account"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3">
                <p className="text-sm text-green-600 dark:text-green-400">
                  {authMode === "signin"
                    ? "Successfully signed in!"
                    : "Account created successfully!"}
                </p>
              </div>
            )}

            {!success && (
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Toggle tabs for Sign In / Register */}
                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                  <button
                    type="button"
                    onClick={() => !isLoading && setAuthMode("signin")}
                    className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                      authMode === "signin"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => !isLoading && setAuthMode("register")}
                    className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                      authMode === "register"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    disabled={isLoading}
                  >
                    Register
                  </button>
                </div>

                {/* Name input (register only) */}
                {authMode === "register" && (
                  <label htmlFor="name-input" className="block space-y-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Display Name
                    </span>
                    <input
                      id="name-input"
                      ref={nameInputRef}
                      type="text"
                      required={authMode === "register"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </label>
                )}

                {/* Email input */}
                <label htmlFor="email-input" className="block space-y-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </span>
                  <input
                    id="email-input"
                    ref={authMode === "signin" ? emailInputRef : undefined}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isLoading}
                    autoComplete={
                      authMode === "signin" ? "email" : "username email"
                    }
                  />
                </label>

                {/* Password input */}
                <label htmlFor="password-input" className="block space-y-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </span>
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      authMode === "signin"
                        ? "Enter your password"
                        : "Create a password (min 6 characters)"
                    }
                    minLength={6}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isLoading}
                    autoComplete={
                      authMode === "signin" ? "current-password" : "new-password"
                    }
                  />
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !email || !password || (authMode === "register" && !name)}
                >
                  {isLoading
                    ? "Please wait..."
                    : authMode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  disabled={isLoading}
                >
                  {authMode === "signin" ? "Register here" : "Sign in here"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
