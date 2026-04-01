import { getAllDocs, getDocBySlug } from "./mdx";

export interface SearchEntry {
  slug: string;
  title: string;
  description?: string;
  headings: string[];
}

export function getSearchData(): SearchEntry[] {
  const docs = getAllDocs();
  return docs.map((meta) => {
    const { content } = getDocBySlug(meta.slug.split("/"));
    // Extract headings from content
    const headings = content
      .split("\n")
      .filter((line) => /^#{1,3}\s/.test(line))
      .map((line) => line.replace(/^#{1,3}\s+/, ""));
    return {
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      headings,
    };
  });
}
