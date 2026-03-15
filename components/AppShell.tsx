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
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 24px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Header */}
      <header>
        {/* Navigation */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
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

        {/* Title */}
        <h1 style={{
          fontSize: "32px",
          fontWeight: 700,
          color: "#111",
          margin: "0 0 8px 0",
        }}>
          {title}
        </h1>
        
        {subtitle && (
          <p style={{
            fontSize: "16px",
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
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: 500,
  color: "#333",
  textDecoration: "none",
  borderRadius: "6px",
  backgroundColor: "#f5f5f5",
  border: "1px solid #ddd",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: 500,
  color: "white",
  backgroundColor: "#2563eb",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginLeft: "auto",
};

const userBadgeStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: 500,
  color: "#16a34a",
  backgroundColor: "#dcfce7",
  borderRadius: "9999px",
  marginLeft: "auto",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: 500,
  color: "#dc2626",
  backgroundColor: "#fee2e2",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};