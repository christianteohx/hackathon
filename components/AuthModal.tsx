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
        headers: {
          "Content-Type": "application/json",
        },
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

      if (onLogin && data.user) {
        onLogin(data.user.name || name, data.user.email);
      }

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
    // Outer container - FULL SCREEN FIXED positioning with CENTERED content
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
      }}
    >
      {/* Blurred dark background overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 999998,
        }}
        onClick={onClose}
      />

      {/* Modal content - centered, with explicit width constraints */}
      <div
        style={{
          position: "relative",
          zIndex: 999999,
          width: "100%",
          maxWidth: "420px",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#0f172a",
                margin: 0,
              }}
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
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                color: "#64748b",
              }}
              aria-label="Close dialog"
            >
              <svg
                width="20"
                height="20"
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
          <div style={{ padding: "24px" }}>
            {error && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <p style={{ margin: 0, fontSize: "14px", color: "#dc2626" }}>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                }}
              >
                <p style={{ margin: 0, fontSize: "14px", color: "#16a34a" }}>
                  {authMode === "signin"
                    ? "Successfully signed in!"
                    : "Account created successfully!"}
                </p>
              </div>
            )}

            {!success && (
              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Toggle tabs */}
                <div
                  style={{
                    display: "flex",
                    borderRadius: "8px",
                    backgroundColor: "#f1f5f9",
                    padding: "4px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => !isLoading && setAuthMode("signin")}
                    style={{
                      flex: 1,
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor:
                        authMode === "signin" ? "white" : "transparent",
                      color: authMode === "signin" ? "#0f172a" : "#64748b",
                      fontWeight: 500,
                      fontSize: "14px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      boxShadow: authMode === "signin" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                    }}
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => !isLoading && setAuthMode("register")}
                    style={{
                      flex: 1,
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor:
                        authMode === "register" ? "white" : "transparent",
                      color: authMode === "register" ? "#0f172a" : "#64748b",
                      fontWeight: 500,
                      fontSize: "14px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      boxShadow: authMode === "register" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                    }}
                    disabled={isLoading}
                  >
                    Register
                  </button>
                </div>

                {/* Name input (register only) */}
                {authMode === "register" && (
                  <label style={{ display: "block" }}>
                    <span style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "4px" }}>
                      Display Name
                    </span>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </label>
                )}

                {/* Email input */}
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "4px" }}>
                    Email Address
                  </span>
                  <input
                    ref={authMode === "signin" ? emailInputRef : undefined}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                {/* Password input */}
                <label style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "4px" }}>
                    Password
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === "signin" ? "Enter your password" : "Create a password (min 6 characters)"}
                    minLength={6}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || !email || !password || (authMode === "register" && !name)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: isLoading || !email || !password || (authMode === "register" && !name) ? "#94a3b8" : "#2563eb",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: isLoading || !email || !password || (authMode === "register" && !name) ? "not-allowed" : "pointer",
                  }}
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
            <div
              style={{
                padding: "16px 24px",
                backgroundColor: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={isLoading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontWeight: 500,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    padding: 0,
                  }}
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