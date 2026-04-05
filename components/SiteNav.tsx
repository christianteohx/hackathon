"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/submit", label: "Submit" },
  { href: "/vote", label: "Vote" },
  { href: "/judge", label: "Judges" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Theme + mounted init
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("theme");
      const dark =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  const toggleMenu = () => setMobileOpen((prev) => !prev);

  const closeMenu = () => setMobileOpen(false);

  const navigateTo = (href: string) => {
    closeMenu();
    router.push(href);
  };

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c.5 0 .79.54.53.97A7 7 0 0 0 20.03 12.26c.43-.26.97.03.97.53Z" />
        </svg>
      )}
    </button>
  );

  // Spacer height matches nav height to prevent content jump
  const spacer = <div className="h-[var(--nav-height,3.5rem)]" />;

  const navBar = (
    <nav
      className="fixed top-0 inset-x-0 bg-[var(--background)] border-b border-[var(--border)] print:hidden"
      style={{ height: "var(--nav-height, 3.5rem)", zIndex: 50 }}
    >
      <div className="max-w-5xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
              H
            </div>
            <span className="font-semibold text-[var(--foreground)] hidden sm:block" style={{ fontFamily: "var(--font-display)" }}>
              Hackathon
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">{themeButton}</div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden ml-auto p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );

  // Mobile overlay (backdrop + slide-in menu) — rendered via portal to document.body
  const mobileOverlay = mounted && createPortal(
    <div
      aria-hidden={!mobileOpen}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 200,
        pointerEvents: mobileOpen ? "auto" : "none",
        opacity: mobileOpen ? 1 : 0,
        visibility: mobileOpen ? "visible" : "hidden",
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Slide-in Menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(18rem, 85vw)",
          backgroundColor: "var(--background)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          zIndex: 201,
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            height: "3.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span className="font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
            Menu
          </span>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", padding: "1rem", gap: "0.25rem", flex: 1 }}>
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <button
                key={href}
                type="button"
                onClick={() => navigateTo(href)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  backgroundColor: active ? "var(--primary)" : "transparent",
                  color: active ? "white" : "var(--foreground)",
                  transition: "all 0.2s",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}

          <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
            {themeButton}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  if (!mounted) {
    return (
      <>
        <div style={{ height: "var(--nav-height, 3.5rem)", borderBottom: "1px solid var(--border)" }} />
        {spacer}
      </>
    );
  }

  return (
    <>
      {navBar}
      {mobileOverlay}
    </>
  );
}
