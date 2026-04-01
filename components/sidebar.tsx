"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface DocLink {
  slug: string;
  title: string;
}

interface SidebarProps {
  docs: DocLink[];
}

const sections = [
  { label: "Overview", filter: (d: DocLink) => !d.slug.match(/^\d/) },
  { label: "Setup", filter: (d: DocLink) => /^0[1-4]/.test(d.slug) },
  { label: "Networking", filter: (d: DocLink) => /^0[5-7]/.test(d.slug) },
  { label: "Automation", filter: (d: DocLink) => /^0[89]/.test(d.slug) },
];

export function Sidebar({ docs }: SidebarProps) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <aside className="hidden md:block fixed top-14 left-0 bottom-0 w-56 border-r border-zinc-800 bg-zinc-950 overflow-y-auto">
      <nav className="p-4 space-y-5">
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
                      ref={active ? activeRef : undefined}
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
    </aside>
  );
}
