"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/submit", label: "Submit" },
  { href: "/vote", label: "Vote" },
  { href: "/judge", label: "Judges" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("theme");
      const shouldUseDark =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", shouldUseDark);
      setIsDark(shouldUseDark);
    } catch {
      // no-op
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    } catch {
      // no-op
    }
  };

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const openMenu = () => {
    setMobileOpen(true);
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
          </svg>
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3c.5 0 .79.54.53.97A7 7 0 0 0 20.03 12.26c.43-.26.97.03.97.53Z" />
          </svg>
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-40 h-14 border-b border-[var(--border)]" />
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md print:hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
                H
              </div>
              <span className="font-semibold text-[var(--foreground)] hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>
                Hackathon
              </span>
            </Link>

            {/* Desktop Nav links */}
            <div className="hidden md:flex items-center gap-1 ml-auto">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
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
              onClick={openMenu}
              className="md:hidden p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          ref={backdropRef}
          className="fixed inset-0 z-[80] bg-black/50"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-[90] h-full w-72 bg-[var(--background)] border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-14 border-b border-[var(--border)]">
            <span className="font-semibold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
              Menu
            </span>
            <button
              type="button"
              onClick={() => { alert("X clicked"); closeMenu(); }}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                    ${isActive
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-2">{themeButton}</div>
          </div>
        </div>
      </div>
    </>
  );
}
