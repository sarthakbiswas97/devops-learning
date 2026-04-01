import type { MDXComponents } from "mdx/types";
import { CopyButton } from "./copy-button";

export const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-3xl font-bold tracking-tight text-zinc-100 mt-8 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="group text-2xl font-semibold text-zinc-100 mt-10 mb-3 pb-2 border-b border-zinc-800"
      {...props}
    >
      {props.children}
      {props.id && (
        <a
          href={`#${props.id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-400 transition-opacity"
          aria-label="Link to section"
        >
          #
        </a>
      )}
    </h2>
  ),
  h3: (props) => (
    <h3
      className="group text-xl font-semibold text-zinc-200 mt-8 mb-2"
      {...props}
    >
      {props.children}
      {props.id && (
        <a
          href={`#${props.id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-400 transition-opacity"
          aria-label="Link to section"
        >
          #
        </a>
      )}
    </h3>
  ),
  p: (props) => (
    <p className="text-zinc-400 leading-7 mb-4" {...props} />
  ),
  a: (props) => (
    <a
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="list-disc pl-6 mb-4 space-y-1 text-zinc-400" {...props} />
  ),
  ol: (props) => (
    <ol
      className="list-decimal pl-6 mb-4 space-y-1 text-zinc-400"
      {...props}
    />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <div className="my-4 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
        <div className="text-sm text-blue-200 [&>p]:mb-0" {...props} />
      </div>
    </div>
  ),
  code: (props) => {
    // rehype-pretty-code adds data-language attribute to code blocks
    const isBlock =
      (typeof props.className === "string" &&
        props.className.includes("language-")) ||
      "data-language" in props;
    if (isBlock) {
      return <code {...props} />;
    }
    return (
      <code
        className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      />
    );
  },
  pre: (props) => {
    // Extract raw text from code children for copy button
    const codeEl = (props.children as React.ReactElement<{ children?: React.ReactNode }>);
    let raw = "";
    if (codeEl?.props?.children) {
      const extractText = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractText).join("");
        if (node && typeof node === "object" && "props" in node) {
          return extractText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
        }
        return "";
      };
      raw = extractText(codeEl.props.children);
    }
    return (
      <div className="group/code relative mb-4">
        <pre
          className="rounded-lg border border-zinc-800 p-4 overflow-x-auto text-sm [&>code]:bg-transparent"
          {...props}
        />
        <CopyButton text={raw} />
      </div>
    );
  },
  table: (props) => (
    <div className="overflow-x-auto mb-4">
      <table
        className="min-w-full text-sm border-collapse border border-zinc-800"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="bg-zinc-800/50 px-4 py-2 text-left text-zinc-300 font-semibold border border-zinc-800"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="px-4 py-2 text-zinc-400 border border-zinc-800"
      {...props}
    />
  ),
  hr: () => <hr className="border-zinc-800 my-8" />,
};
