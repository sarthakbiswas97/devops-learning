"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  docs: { slug: string; title: string }[];
}

export function Sidebar({ docs }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto w-52 shrink-0 pr-6">
      <nav className="space-y-1">
        {docs.map((doc) => {
          const href = `/docs/${doc.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={doc.slug}
              href={href}
              className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                active
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              {doc.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
