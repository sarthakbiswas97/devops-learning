import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getAllDocs } from "@/lib/mdx";
import { MobileNav } from "@/components/mobile-nav";
import { Search } from "@/components/search";
import { getSearchData } from "@/lib/search-data";
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
  description:
    "Deploy any Dockerized project to a VPS with GHCR, Nginx, SSL, and GitHub Actions auto-deploy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allDocs = getAllDocs();
  const searchEntries = getSearchData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans antialiased">
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-3">
            <MobileNav docs={allDocs} />
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-zinc-100"
            >
              VPS Deploy Guide
            </Link>
            <Search entries={searchEntries} />
          </div>
        </header>
        <main className="flex-1 flex flex-col pt-14">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
          Built with Next.js &middot; VPS Deploy Guide
        </footer>
      </body>
    </html>
  );
}
