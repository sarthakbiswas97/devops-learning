import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface DocMeta {
  slug: string;
  title: string;
  description?: string;
  order?: number;
}

export function getDocSlugs(): string[][] {
  const slugs: string[][] = [];

  function walk(dir: string, prefix: string[] = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
        const name = entry.name.replace(/\.mdx?$/, "");
        slugs.push([...prefix, name]);
      }
    }
  }

  walk(contentDir);
  return slugs;
}

export function getDocBySlug(slug: string[]): {
  content: string;
  meta: DocMeta;
} {
  const slugPath = slug.join("/");
  const mdxPath = path.join(contentDir, slugPath + ".mdx");
  const mdPath = path.join(contentDir, slugPath + ".md");

  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    content,
    meta: {
      slug: slugPath,
      title: data.title || slug[slug.length - 1],
      description: data.description,
      order: data.order,
    },
  };
}

export function getAllDocs(): DocMeta[] {
  return getDocSlugs()
    .map((slug) => getDocBySlug(slug).meta)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
