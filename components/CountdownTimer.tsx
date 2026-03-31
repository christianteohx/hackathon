'use client';

import { useEffect, useState } from 'react';

type CountdownTimerProps = {
  deadline: Date | null;
  label?: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeLeft(deadline: Date) {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function CountdownTimer({ deadline, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!deadline) return;

    const tick = () => {
      setTimeLeft(getTimeLeft(deadline));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!mounted) return null;

  if (!deadline) return null;

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-sm font-semibold">
        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
        Voting is open
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-sm font-semibold">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {label && `${label} · `}
        {days > 0 ? `${days}d ` : ''}
        {(days > 0 || hours > 0) ? `${hours}h ` : ''}
        {minutes}m {seconds}s remaining
      </span>
    </div>
  );
}
