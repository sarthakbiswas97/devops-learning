import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { getDocBySlug, getDocSlugs, getAllDocs } from "@/lib/mdx";
import { components } from "@/components/mdx-components";
import { TableOfContents } from "@/components/toc";
import { Sidebar } from "@/components/sidebar";
import { PrevNext } from "@/components/prev-next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  try {
    const { meta } = getDocBySlug(slug);
    return {
      title: `${meta.title} — VPS Deploy Guide`,
      description: meta.description,
    };
  } catch {
    return { title: "Not Found — VPS Deploy Guide" };
  }
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
    <>
      <Sidebar docs={allDocs} />
      <TableOfContents />
      <div className="md:ml-56 xl:mr-56 px-8 py-12 max-w-3xl mx-auto w-full">
        <Breadcrumbs title={doc.meta.title} />
        <article>
          <MDXRemote
            source={doc.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  rehypeAutolinkHeadings,
                  [rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true }],
                ],
              },
            }}
          />
        </article>
        <PrevNext currentSlug={doc.meta.slug} allDocs={allDocs} />
      </div>
    </>
  );
}
