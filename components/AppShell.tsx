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
    <main style={{
      width: "100%",
      maxWidth: "700px",
      margin: "0 auto",
      padding: "24px 20px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <header style={{ marginBottom: "8px" }}>
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/vote" style={navLinkStyle}>Vote</Link>
          <Link href="/my" style={navLinkStyle}>My Page</Link>
          <Link href="/leaderboard" style={navLinkStyle}>Leaderboard</Link>
          
          {!isAuthed ? (
            <button type="button" onClick={() => openAuthModal("sign in")} style={primaryButtonStyle}>
              Login / Register
            </button>
          ) : (
            <>
              <span style={userBadgeStyle}>{user?.email}</span>
              <button type="button" onClick={logout} style={logoutButtonStyle}>
                Logout
              </button>
            </>
          )}
        </nav>

        <h1 style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#111",
          margin: "0 0 6px 0",
        }}>
          {title}
        </h1>
        
        {subtitle && (
          <p style={{
            fontSize: "14px",
            color: "#666",
            margin: 0,
            lineHeight: 1.5,
          }}>
            {subtitle}
          </p>
        )}
      </header>

      {children}
    </main>
  );
}

const navLinkStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: "13px",
  fontWeight: 500,
  color: "#444",
  textDecoration: "none",
  borderRadius: "4px",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ddd",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: "13px",
  fontWeight: 500,
  color: "white",
  backgroundColor: "#2563eb",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginLeft: "auto",
};

const userBadgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: "11px",
  fontWeight: 500,
  color: "#16a34a",
  backgroundColor: "#dcfce7",
  borderRadius: "9999px",
  marginLeft: "auto",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: "11px",
  fontWeight: 500,
  color: "#dc2626",
  backgroundColor: "#fee2e2",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};