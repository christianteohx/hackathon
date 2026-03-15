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
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px 16px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    }}>
      <header>
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "12px",
        }}>
          <Link href="/" style={linkStyle}>Home</Link>
          <Link href="/vote" style={linkStyle}>Vote</Link>
          <Link href="/my" style={linkStyle}>My</Link>
          <Link href="/leaderboard" style={linkStyle}>Board</Link>
          
          {!isAuthed ? (
            <button type="button" onClick={() => openAuthModal("sign in")} style={blueBtnStyle}>
              Login
            </button>
          ) : (
            <>
              <span style={greenBadgeStyle}>{user?.email?.split('@')[0]}</span>
              <button type="button" onClick={logout} style={redBtnStyle}>Logout</button>
            </>
          )}
        </nav>

        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#222", margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "14px", color: "#666", margin: "4px 0 0" }}>
            {subtitle}
          </p>
        )}
      </header>

      {children}
    </main>
  );
}

const linkStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: "12px",
  color: "#555",
  textDecoration: "none",
  backgroundColor: "#eee",
  borderRadius: "4px",
};

const blueBtnStyle: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: "12px",
  color: "#fff",
  backgroundColor: "#3b82f6",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginLeft: "auto",
};

const greenBadgeStyle: React.CSSProperties = {
  padding: "4px 8px",
  fontSize: "11px",
  color: "#16a34a",
  backgroundColor: "#dcfce7",
  borderRadius: "4px",
  marginLeft: "auto",
};

const redBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  fontSize: "11px",
  color: "#dc2626",
  backgroundColor: "#fee2e2",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};