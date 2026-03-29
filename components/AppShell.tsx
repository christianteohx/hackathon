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
    <main className="w-full px-6 py-12 min-h-screen flex flex-col bg-white">
      <div className="max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <nav className="flex items-center gap-2 mb-6 flex-wrap">
            <Link href="/" className={linkClassName}>Home</Link>
            <Link href="/vote" className={linkClassName}>Vote</Link>
            <Link href="/my" className={linkClassName}>My</Link>
            <Link href="/leaderboard" className={linkClassName}>Board</Link>

            {!isAuthed ? (
              <button type="button" onClick={() => openAuthModal("sign in")} className={loginBtnClassName}>
                Login
              </button>
            ) : (
              <>
                <span className={userBadgeClassName}>{user?.email?.split('@')[0]}</span>
                <button type="button" onClick={logout} className={logoutBtnClassName}>Logout</button>
              </>
            )}
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base text-gray-500 mt-2">
              {subtitle}
            </p>
          )}
        </header>

        {children}
      </div>
    </main>
  );
}

const linkClassName = "text-gray-500 hover:text-blue-500 transition-colors px-3 py-1 rounded-md text-sm font-medium";
const loginBtnClassName = "ml-auto px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm";
const userBadgeClassName = "ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700";
const logoutBtnClassName = "px-3 py-1 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors";
