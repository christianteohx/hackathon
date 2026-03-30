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

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
