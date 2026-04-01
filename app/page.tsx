import Link from "next/link";
import { getAllDocs } from "@/lib/mdx";

export default function Home() {
  const docs = getAllDocs();

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-xl w-full py-24">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">
          Documentation
        </h1>
        <p className="text-zinc-500 mb-10">
          Select a page to get started.
        </p>
        <div className="space-y-2">
          {docs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="block p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors"
            >
              <p className="font-medium text-zinc-200">{doc.title}</p>
              {doc.description && (
                <p className="text-sm text-zinc-500 mt-1">
                  {doc.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
