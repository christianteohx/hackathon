"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useAppState } from "@/lib/app-state";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { isAuthed, user, logout, openAuthModal } = useAppState();

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 16px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Link
            href="/"
            style={{
              borderRadius: "9999px",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              padding: "6px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#334155",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
          >
            Home
          </Link>
          <Link
            href="/vote"
            style={{
              borderRadius: "9999px",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              padding: "6px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#334155",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
          >
            Vote
          </Link>
          <Link
            href="/my"
            style={{
              borderRadius: "9999px",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              padding: "6px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#334155",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
          >
            My Page
          </Link>
          <Link
            href="/leaderboard"
            style={{
              borderRadius: "9999px",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              padding: "6px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#334155",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
          >
            Leaderboard
          </Link>

          {!isAuthed ? (
            <button
              type="button"
              onClick={() => openAuthModal("sign in")}
              style={{
                borderRadius: "9999px",
                border: "1px solid #3b82f6",
                backgroundColor: "#3b82f6",
                padding: "6px 16px",
                fontSize: "14px",
                fontWeight: 500,
                color: "white",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              Login / Register
            </button>
          ) : (
            <>
              <span
                style={{
                  borderRadius: "9999px",
                  border: "1px solid #a7f3d0",
                  backgroundColor: "#f0fdf4",
                  padding: "6px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#16a34a",
                  marginLeft: "auto",
                }}
              >
                {user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                style={{
                  borderRadius: "9999px",
                  border: "1px solid #fecdd3",
                  backgroundColor: "#fff1f2",
                  padding: "6px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#e11d48",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Title & Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              style={{
                maxWidth: "600px",
                fontSize: "16px",
                color: "#64748b",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </header>

      {children}
    </main>
  );
}