import "server-only";

import { cacheScrapEntryHtml } from "./repository";
import type { ScrapBodyHtml, ScrapEntry } from "./types";

// Increment when Markdown rendering, sanitization, or highlighting changes.
const SCRAP_HTML_VERSION = 1;

export async function renderScrapBody(markdown: string): Promise<ScrapBodyHtml> {
  const { renderScrapMarkdown } = await import("./markdown");
  return { html: await renderScrapMarkdown(markdown), version: SCRAP_HTML_VERSION };
}

export async function getScrapEntryHtml(db: D1Database, entry: ScrapEntry): Promise<string> {
  if (entry.bodyHtml !== null && entry.bodyHtmlVersion === SCRAP_HTML_VERSION) {
    return entry.bodyHtml;
  }

  // Legacy entries and outdated HTML are rendered once, then reused across requests.
  const body = await renderScrapBody(entry.bodyMarkdown);
  try {
    await cacheScrapEntryHtml(db, entry, body);
  } catch (error) {
    // A cache write failure must not prevent an otherwise valid entry from rendering.
    console.error(
      JSON.stringify({
        event: "scrap_html_cache_write_failed",
        entryId: entry.id,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
  return body.html;
}
