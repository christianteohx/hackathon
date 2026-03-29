import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Inter } from "@next/font/google"; // Import Inter font
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font

export const metadata: Metadata = {
  title: "Hackathon Project Voting",
  description: "Mocked hackathon voting and project membership flow"
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
          <nav className="border-b border-gray-200 bg-white px-6 py-4 mb-6">
            <div className="max-w-4xl mx-auto flex gap-6">
              <Link href="/" className="font-semibold">Home</Link>
              <Link href="/submit">Submit</Link>
              <Link href="/vote">Vote</Link>
              <Link href="/leaderboard">Leaderboard</Link>
            </div>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
