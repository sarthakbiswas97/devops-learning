import type { MDXComponents } from "mdx/types";

export const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-3xl font-bold tracking-tight text-zinc-100 mt-8 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl font-semibold text-zinc-100 mt-10 mb-3 pb-2 border-b border-zinc-800"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl font-semibold text-zinc-200 mt-8 mb-2"
      {...props}
    />
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
    <blockquote
      className="border-l-2 border-zinc-700 pl-4 italic text-zinc-500 my-4"
      {...props}
    />
  ),
  code: (props) => {
    const isBlock =
      typeof props.className === "string" &&
      props.className.includes("language-");
    if (isBlock) {
      return (
        <code className={`${props.className} text-sm`} {...props} />
      );
    }
    return (
      <code
        className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      />
    );
  },
  pre: (props) => (
    <pre
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4 text-sm"
      {...props}
    />
  ),
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
