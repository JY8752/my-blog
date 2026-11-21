import "server-only";

import { cacheScrapEntryHtml } from "./repository";
import type { ScrapBodyHtml, ScrapEntry } from "./types";

// Markdownの変換・サニタイズ・ハイライトの仕様を変更したら更新する。
const SCRAP_HTML_VERSION = 1;

export async function renderScrapBody(markdown: string): Promise<ScrapBodyHtml> {
  const { renderScrapMarkdown } = await import("./markdown");
  return { html: await renderScrapMarkdown(markdown), version: SCRAP_HTML_VERSION };
}

export async function getScrapEntryHtml(db: D1Database, entry: ScrapEntry): Promise<string> {
  if (entry.bodyHtml !== null && entry.bodyHtmlVersion === SCRAP_HTML_VERSION) {
    return entry.bodyHtml;
  }

  // 既存投稿と古いHTMLは生成し直して保存し、次回以降のリクエストで再利用する。
  const body = await renderScrapBody(entry.bodyMarkdown);
  try {
    await cacheScrapEntryHtml(db, entry, body);
  } catch (error) {
    // キャッシュの保存に失敗しても、生成済みのHTMLは表示できるようにする。
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
