import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { getAllDocs, getDocBySlug } from "@/lib/mdx";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

function getDocsContext(): string {
  const docs = getAllDocs();
  return docs
    .map((meta) => {
      const { content } = getDocBySlug(meta.slug.split("/"));
      return `## ${meta.title}\n${content}`;
    })
    .join("\n\n---\n\n");
}

const docsContext = getDocsContext();

const systemPrompt = `You are a helpful assistant for the VPS Deploy Guide documentation site. Answer questions based on the documentation below. Be concise and direct. If you include commands, format them in code blocks. If the answer isn't covered in the docs, say so.

---

${docsContext}`;

interface UIMessage {
  role: "user" | "assistant";
  parts?: { type: string; text?: string }[];
  content?: string;
}

function convertMessages(messages: UIMessage[]) {
  return messages.map((msg) => ({
    role: msg.role,
    content:
      msg.content ??
      msg.parts
        ?.filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("") ??
      "",
  }));
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemPrompt,
    messages: convertMessages(messages),
  });

  return result.toTextStreamResponse();
}
