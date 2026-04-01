import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VPS Deploy Guide",
  description: "Deploy any Dockerized project to a VPS with GHCR, Nginx, SSL, and GitHub Actions auto-deploy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans antialiased">
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
            <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-100">
              VPS Deploy Guide
            </Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
