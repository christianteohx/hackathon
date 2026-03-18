import type { Metadata } from "next";
import type { ReactNode } from "react";
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
