import "server-only";

import markdownToHtml from "zenn-markdown-html";

export async function renderScrapMarkdown(markdown: string): Promise<string> {
  if (!markdown.trim()) return "";

  return markdownToHtml(markdown, {
    embedOrigin: "https://embed.zenn.studio",
  });
}
