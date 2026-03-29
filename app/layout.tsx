import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "@next/font/google";
import { Providers } from "./providers";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font

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

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}> {/* Apply Inter font class */}
        <Providers>
          <SiteNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
