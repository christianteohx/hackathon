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
    <main className="min-h-screen flex flex-col bg-[var(--background)]">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-12">
        {/* Page Header */}
        <header className="mb-10 print:hidden">
          {/* Breadcrumb / Back nav */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
            <span className="text-[var(--muted-foreground)]">/</span>
            <span className="text-[var(--foreground)]">{title}</span>
            
            {/* Auth */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {!isAuthed ? (
                <button 
                  type="button" 
                  onClick={() => openAuthModal("sign in")} 
                  className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Login
                </button>
              ) : (
                <>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--muted)] text-[var(--muted-foreground)]">
                    {user?.email?.split('@')[0]}
                  </span>
                  <button 
                    type="button" 
                    onClick={logout} 
                    className="text-xs font-medium text-[var(--error)] hover:opacity-80 transition-opacity"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="mt-3 text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl">
              {subtitle}
            </p>
          )}
          
          {/* Divider */}
          <div className="mt-8 h-px bg-[var(--border)]" />
        </header>

        {/* Content */}
        {children}
      </div>
    </main>
  );
}
