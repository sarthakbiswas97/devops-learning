import Link from "next/link";

interface BreadcrumbsProps {
  title: string;
}

export function Breadcrumbs({ title }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-zinc-500 mb-6">
      <Link href="/" className="hover:text-zinc-300 transition-colors">
        Home
      </Link>
      <span>/</span>
      <span className="text-zinc-400">{title}</span>
    </nav>
  );
}
