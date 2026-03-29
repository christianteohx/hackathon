"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/submit", label: "Submit" },
  { href: "/vote", label: "Vote" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/admin", label: "Admin" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4 mb-6">
      <div className="max-w-4xl mx-auto flex gap-6">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-purple-700 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
