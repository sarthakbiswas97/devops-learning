import Link from "next/link";
import type { DocMeta } from "@/lib/mdx";

interface PrevNextProps {
  currentSlug: string;
  allDocs: DocMeta[];
}

export function PrevNext({ currentSlug, allDocs }: PrevNextProps) {
  const idx = allDocs.findIndex((d) => d.slug === currentSlug);
  const prev = idx > 0 ? allDocs[idx - 1] : null;
  const next = idx < allDocs.length - 1 ? allDocs[idx + 1] : null;

  return (
    <div className="mt-12 flex items-stretch gap-4 border-t border-zinc-800 pt-6">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex-1 flex flex-col rounded-lg border border-zinc-800 px-4 py-3 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors"
        >
          <span className="text-xs text-zinc-500 mb-1">Previous</span>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
            &larr; {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex-1 flex flex-col items-end text-right rounded-lg border border-zinc-800 px-4 py-3 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors"
        >
          <span className="text-xs text-zinc-500 mb-1">Next</span>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
            {next.title} &rarr;
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
