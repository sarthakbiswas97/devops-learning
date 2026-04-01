import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getDocBySlug, getDocSlugs, getAllDocs } from "@/lib/mdx";
import { components } from "@/components/mdx-components";
import { TableOfContents } from "@/components/toc";
import { Sidebar } from "@/components/sidebar";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  return params.then(({ slug }) => {
    try {
      const { meta } = getDocBySlug(slug);
      return { title: meta.title, description: meta.description };
    } catch {
      return { title: "Not Found" };
    }
  });
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  let doc;
  try {
    doc = getDocBySlug(slug);
  } catch {
    notFound();
  }

  const allDocs = getAllDocs();

  return (
    <div className="flex gap-8 max-w-7xl mx-auto w-full px-6 py-12">
      <Sidebar docs={allDocs} />
      <article className="flex-1 min-w-0 max-w-3xl">
        <MDXRemote
          source={doc.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            },
          }}
        />
      </article>
      <TableOfContents />
    </div>
  );
}
