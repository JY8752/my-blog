import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getScrapEntryHtml, renderScrapBody } from "./entry-html";
import { renderScrapMarkdown } from "./markdown";
import { cacheScrapEntryHtml } from "./repository";
import type { ScrapEntry } from "./types";

vi.mock("server-only", () => ({}));
vi.mock("./markdown", () => ({ renderScrapMarkdown: vi.fn() }));
vi.mock("./repository", () => ({ cacheScrapEntryHtml: vi.fn() }));

const db: D1Database = {
  prepare: vi.fn(),
  batch: vi.fn(),
  exec: vi.fn(),
  withSession: vi.fn(),
  dump: vi.fn(),
};
const savedEntry: ScrapEntry = {
  id: "entry-id",
  scrapId: "scrap-id",
  bodyMarkdown: "本文",
  bodyHtml: "<p>保存済みの本文</p>",
  bodyHtmlVersion: 1,
  position: 1,
  isPinned: false,
  createdAt: "2026-11-01T00:00:00Z",
  updatedAt: "2026-11-01T00:00:00Z",
};

beforeEach(() => vi.resetAllMocks());
afterEach(() => vi.restoreAllMocks());

describe("renderScrapBody", () => {
  it("変換したHTMLに現在の生成バージョンを付けて返す", async () => {
    const markdown = "本文";
    vi.mocked(renderScrapMarkdown).mockResolvedValue("<p>変換した本文</p>");

    const result = await renderScrapBody(markdown);

    expect(result).toEqual({ html: "<p>変換した本文</p>", version: 1 });
  });
});

describe("getScrapEntryHtml", () => {
  it("現在の生成バージョンで保存されたHTMLを返す", async () => {
    const entry = { ...savedEntry };

    const result = await getScrapEntryHtml(db, entry);

    expect(result).toBe("<p>保存済みの本文</p>");
  });

  it("保存済みHTMLが現在の生成バージョンならDBへ書き込まない", async () => {
    const entry = { ...savedEntry };

    await getScrapEntryHtml(db, entry);

    expect(cacheScrapEntryHtml).not.toHaveBeenCalled();
  });

  describe.each([
    { condition: "HTMLが未保存の場合", bodyHtml: null, bodyHtmlVersion: null },
    { condition: "生成バージョンが古い場合", bodyHtml: "<p>古い本文</p>", bodyHtmlVersion: 0 },
  ])("$condition", ({ bodyHtml, bodyHtmlVersion }) => {
    it("本文から生成したHTMLを返す", async () => {
      const entry = { ...savedEntry, bodyHtml, bodyHtmlVersion };
      vi.mocked(renderScrapMarkdown).mockResolvedValue("<p>新しく生成した本文</p>");

      const result = await getScrapEntryHtml(db, entry);

      expect(result).toBe("<p>新しく生成した本文</p>");
    });

    it("生成したHTMLと現在の生成バージョンを保存する", async () => {
      const entry = { ...savedEntry, bodyHtml, bodyHtmlVersion };
      vi.mocked(renderScrapMarkdown).mockResolvedValue("<p>新しく生成した本文</p>");

      await getScrapEntryHtml(db, entry);

      expect(cacheScrapEntryHtml).toHaveBeenCalledExactlyOnceWith(db, entry, {
        html: "<p>新しく生成した本文</p>",
        version: 1,
      });
    });
  });

  it("HTMLの保存に失敗しても生成済みのHTMLを返す", async () => {
    const entry = { ...savedEntry, bodyHtml: null, bodyHtmlVersion: null };
    vi.mocked(renderScrapMarkdown).mockResolvedValue("<p>生成した本文</p>");
    vi.mocked(cacheScrapEntryHtml).mockRejectedValue(new Error("D1への保存失敗"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getScrapEntryHtml(db, entry);

    expect(result).toBe("<p>生成した本文</p>");
  });
});
