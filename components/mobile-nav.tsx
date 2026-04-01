"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DocLink {
  slug: string;
  title: string;
}

const sections = [
  { label: "Overview", filter: (d: DocLink) => !d.slug.match(/^\d/) },
  { label: "Setup", filter: (d: DocLink) => /^0[1-4]/.test(d.slug) },
  { label: "Networking", filter: (d: DocLink) => /^0[5-7]/.test(d.slug) },
  { label: "Automation", filter: (d: DocLink) => /^0[89]/.test(d.slug) },
];

export function MobileNav({ docs }: { docs: DocLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-1.5 -ml-1.5 text-zinc-400 hover:text-zinc-200"
        aria-label="Open navigation"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-800">
          <Link href="/" className="text-sm font-semibold text-zinc-100">
            VPS Deploy Guide
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-zinc-400 hover:text-zinc-200"
            aria-label="Close navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 space-y-4 overflow-y-auto h-[calc(100%-3.5rem)]">
          {sections.map((section) => {
            const items = docs.filter(section.filter);
            if (items.length === 0) return null;
            return (
              <div key={section.label}>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-3">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {items.map((doc) => {
                    const href = `/docs/${doc.slug}`;
                    const active = pathname === href;
                    const stepNum = doc.slug.match(/^(\d+)/)?.[1];
                    return (
                      <Link
                        key={doc.slug}
                        href={href}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                          active
                            ? "bg-zinc-800 text-zinc-100"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                      >
                        {stepNum && (
                          <span className="text-xs text-zinc-600 font-mono w-4 shrink-0">
                            {stepNum}
                          </span>
                        )}
                        <span>{doc.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
