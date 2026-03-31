"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/submit", label: "Submit" },
  { href: "/vote", label: "Vote" },
  { href: "/judge", label: "Judges" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              H
            </div>
            <span className="font-semibold text-[var(--foreground)] hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>
              Hackathon
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
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
        </div>
      </div>
    </nav>
  );
}
