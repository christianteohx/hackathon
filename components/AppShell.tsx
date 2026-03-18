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
    <main className="w-full px-8 py-8 min-h-screen flex flex-col space-y-8 bg-white font-inter">
      <header className="mb-6">
        <nav className="flex items-center space-x-2 mb-4">
          <Link href="/" className={linkClassName}>Home</Link>
          <Link href="/vote" className={linkClassName}>Vote</Link>
          <Link href="/my" className={linkClassName}>My</Link>
          <Link href="/leaderboard" className={linkClassName}>Board</Link>
          
          {!isAuthed ? (
            <button type="button" onClick={() => openAuthModal("sign in")} className={goldBtnClassName}>
              Login
            </button>
          ) : (
            <>
              <span className={userBadgeClassName}>{user?.email?.split('@')[0]}</span>
              <button type="button" onClick={logout} className={logoutBtnClassName}>Logout</button>
            </>
          )}
        </nav>

        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">
            {subtitle}
          </p>
        )}
      </header>

      {children}
    </main>
  );
}

const linkClassName = "text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1 rounded-md text-sm font-medium";
const goldBtnClassName = "ml-auto px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-md";
const userBadgeClassName = "ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800";
const logoutBtnClassName = "px-3 py-1 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors";