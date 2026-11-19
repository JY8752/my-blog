import { readFile, readdir } from "node:fs/promises";
import { Miniflare } from "miniflare";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getScrapEntryHtml, renderScrapBody } from "./entry-html";
import { renderScrapMarkdown } from "./markdown";
import * as repository from "./repository";

vi.mock("server-only", () => ({}));
vi.mock("./markdown", () => ({
  renderScrapMarkdown: vi.fn(async (markdown: string) => `<p>${markdown}</p>`),
}));

let mf: Miniflare;
let db: D1Database;

beforeAll(async () => {
  mf = new Miniflare({
    modules: true,
    script: "export default { fetch() { return new Response('ok'); } }",
    compatibilityDate: "2026-07-21",
    d1Databases: { DB: "scrap-html-test" },
  });
  db = await mf.getD1Database("DB");

  for (const file of (await readdir("migrations")).filter((file) => file.endsWith(".sql")).sort()) {
    const sql = await readFile(`migrations/${file}`, "utf8");
    await db.batch(
      sql
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean)
        .map((statement) => db.prepare(statement)),
    );
  }
});

beforeEach(async () => {
  vi.clearAllMocks();
  await db.batch([db.prepare("DELETE FROM scrap_entries"), db.prepare("DELETE FROM scraps")]);
});

afterEach(() => vi.restoreAllMocks());
afterAll(async () => mf?.dispose());

async function createScrap() {
  const input = { slug: "test-scrap", title: "Test", tags: [], bodyMarkdown: "first entry" };
  return repository.createScrap(db, input, await renderScrapBody(input.bodyMarkdown));
}

describe("persisted Scrap HTML", () => {
  it("stores HTML when creating and appending entries, then reads without converting again", async () => {
    const scrap = await createScrap();
    const body = await renderScrapBody("second entry");
    const added = await repository.addScrapEntry(
      db,
      { scrapId: scrap.id, bodyMarkdown: "second entry" },
      body,
    );
    expect(added.position).toBe(2);
    expect(added.bodyHtml).toBe("<p>second entry</p>");

    vi.mocked(renderScrapMarkdown).mockClear();
    const loaded = await repository.getScrapBySlug(db, scrap.slug);
    expect(loaded?.entries).toHaveLength(2);
    const html = await Promise.all(loaded!.entries.map((entry) => getScrapEntryHtml(db, entry)));
    expect(html).toEqual(["<p>first entry</p>", "<p>second entry</p>"]);
    expect(renderScrapMarkdown).not.toHaveBeenCalled();
  });

  it("backfills legacy entries once without changing the Scrap update timestamp", async () => {
    const scrap = await createScrap();
    await db.prepare("UPDATE scrap_entries SET body_html = NULL, body_html_version = NULL").run();
    vi.mocked(renderScrapMarkdown).mockClear();

    const legacy = await repository.getScrapById(db, scrap.id);
    expect(await getScrapEntryHtml(db, legacy!.entries[0])).toBe("<p>first entry</p>");
    const cached = await repository.getScrapById(db, scrap.id);
    expect(await getScrapEntryHtml(db, cached!.entries[0])).toBe("<p>first entry</p>");
    expect(renderScrapMarkdown).toHaveBeenCalledTimes(1);
    expect(cached?.updatedAt).toBe(scrap.updatedAt);
    expect(cached?.entries[0].updatedAt).toBe(scrap.entries[0].updatedAt);
  });

  it("regenerates HTML produced by an older renderer version", async () => {
    const scrap = await createScrap();
    await db
      .prepare("UPDATE scrap_entries SET body_html = 'old HTML', body_html_version = 0")
      .run();
    const stale = await repository.getScrapById(db, scrap.id);
    expect(await getScrapEntryHtml(db, stale!.entries[0])).toBe("<p>first entry</p>");
    const refreshed = await repository.getScrapById(db, scrap.id);
    expect(refreshed?.entries[0].bodyHtmlVersion).toBe(scrap.entries[0].bodyHtmlVersion);
    expect(refreshed?.entries[0].bodyHtml).toBe("<p>first entry</p>");
  });

  it("does not attach HTML from an earlier read to a changed Markdown body", async () => {
    const scrap = await createScrap();
    const previous = { ...scrap.entries[0], bodyHtml: null, bodyHtmlVersion: null };
    await db
      .prepare(
        "UPDATE scrap_entries SET body_markdown = 'edited', body_html = NULL, body_html_version = NULL",
      )
      .run();

    await getScrapEntryHtml(db, previous);
    const edited = await repository.getScrapById(db, scrap.id);
    expect(edited?.entries[0].bodyHtml).toBeNull();
    expect(await getScrapEntryHtml(db, edited!.entries[0])).toBe("<p>edited</p>");
  });

  it("still renders when saving a legacy entry's cached HTML fails", async () => {
    const scrap = await createScrap();
    vi.spyOn(repository, "cacheScrapEntryHtml").mockRejectedValueOnce(new Error("D1 unavailable"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(
      await getScrapEntryHtml(db, { ...scrap.entries[0], bodyHtml: null, bodyHtmlVersion: null }),
    ).toBe("<p>first entry</p>");
    expect(log).toHaveBeenCalledOnce();
  });

  it("preserves entry order and cached HTML when pinning and deleting", async () => {
    const scrap = await createScrap();
    const added = await repository.addScrapEntry(
      db,
      { scrapId: scrap.id, bodyMarkdown: "pinned entry" },
      await renderScrapBody("pinned entry"),
    );
    await repository.setPinnedScrapEntry(db, scrap.id, added.id, true);
    const pinned = await repository.getScrapById(db, scrap.id);
    expect(pinned?.entries.map((entry) => entry.bodyHtml)).toEqual([
      "<p>pinned entry</p>",
      "<p>first entry</p>",
    ]);

    await repository.deleteScrap(db, scrap.id);
    expect(await db.prepare("SELECT COUNT(*) AS count FROM scrap_entries").first("count")).toBe(0);
  });
});
