import type { Metadata } from "next";
import { Providers } from "./providers";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hackathon Voting Platform",
  description:
    "Submit your hackathon project, vote on others, and crown a winner. Features blind voting, AI judging, and live leaderboards.",
  openGraph: {
    title: "Hackathon Voting Platform",
    description: "Vote. Win. Repeat.",
    type: "website",
  },
};

const themeInitScript = `
(() => {
  try {
    const saved = localStorage.getItem('theme');
    const shouldUseDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  } catch {}
})();
`;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <SiteNav />
          <div style={{ paddingTop: "var(--nav-height, 3.5rem)" }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
