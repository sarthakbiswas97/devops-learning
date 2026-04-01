"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchEntry {
  slug: string;
  title: string;
  description?: string;
  headings: string[];
}

export function Search({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  // cmd+k handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const results = query.trim()
    ? entries.filter((entry) => {
        const q = query.toLowerCase();
        return (
          entry.title.toLowerCase().includes(q) ||
          (entry.description?.toLowerCase().includes(q)) ||
          entry.headings.some((h) => h.toLowerCase().includes(q))
        );
      })
    : entries;

  const navigate = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/docs/${slug}`);
    },
    [router]
  );

  // Reset selected when results change
  useEffect(() => {
    setSelected(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].slug);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 border border-zinc-800 rounded-lg px-3 py-1.5 hover:border-zinc-700 hover:text-zinc-400 transition-colors ml-auto"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        Search
        <kbd className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
          <svg className="h-4 w-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search docs..."
            className="flex-1 bg-transparent py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
          />
          <kbd
            className="text-[10px] text-zinc-600 bg-zinc-800 rounded px-1.5 py-0.5 font-mono cursor-pointer"
            onClick={() => setOpen(false)}
          >
            ESC
          </kbd>
        </div>

        <ul className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-zinc-500">
              No results found.
            </li>
          ) : (
            results.map((entry, i) => (
              <li key={entry.slug}>
                <button
                  onClick={() => navigate(entry.slug)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full text-left px-4 py-2.5 flex flex-col gap-0.5 transition-colors ${
                    i === selected
                      ? "bg-zinc-800/80 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-800/40"
                  }`}
                >
                  <span className="text-sm font-medium">{entry.title}</span>
                  {entry.description && (
                    <span className="text-xs text-zinc-500 line-clamp-1">
                      {entry.description}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
