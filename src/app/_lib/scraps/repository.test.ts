import { readFile, readdir } from "node:fs/promises";
import { Miniflare } from "miniflare";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addScrapEntry,
  cacheScrapEntryHtml,
  createScrap,
  deleteScrap,
  getScrapById,
  setPinnedScrapEntry,
} from "./repository";

vi.mock("server-only", () => ({}));

let mf: Miniflare;
let db: D1Database;
const originalDate = "2026-11-01T00:00:00Z";

beforeAll(async () => {
  mf = new Miniflare({
    modules: true,
    script: "export default { fetch() { return new Response('ok'); } }",
    compatibilityDate: "2026-07-21",
    d1Databases: { DB: "scrap-repository-test" },
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
  await db.batch([db.prepare("DELETE FROM scrap_entries"), db.prepare("DELETE FROM scraps")]);
});

afterAll(async () => mf?.dispose());

async function seedScrap() {
  await db
    .prepare(
      "INSERT INTO scraps (id, slug, title, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind("scrap-id", "test-scrap", "テスト用Scrap", "[]", originalDate, originalDate)
    .run();
}

async function seedEntry({
  id = "entry-id",
  markdown = "本文",
  html = null,
  version = null,
  position = 1,
  pinned = false,
}: {
  id?: string;
  markdown?: string;
  html?: string | null;
  version?: number | null;
  position?: number;
  pinned?: boolean;
} = {}) {
  await db
    .prepare(`INSERT INTO scrap_entries
      (id, scrap_id, body_markdown, body_html, body_html_version, position, is_pinned, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      id,
      "scrap-id",
      markdown,
      html,
      version,
      position,
      Number(pinned),
      originalDate,
      originalDate,
    )
    .run();
}

describe("createScrap", () => {
  it("最初の投稿にHTMLと生成バージョンを保存する", async () => {
    const input = { slug: "new-scrap", title: "新しいScrap", tags: [], bodyMarkdown: "本文" };
    const body = { html: "<p>本文</p>", version: 7 };

    const scrap = await createScrap(db, input, body);

    const saved = await db
      .prepare("SELECT body_html, body_html_version FROM scrap_entries WHERE scrap_id = ?")
      .bind(scrap.id)
      .first();
    expect(saved).toEqual({ body_html: "<p>本文</p>", body_html_version: 7 });
  });
});

describe("addScrapEntry", () => {
  it("追記した投稿にHTMLと生成バージョンを保存する", async () => {
    await seedScrap();
    const input = { scrapId: "scrap-id", bodyMarkdown: "追記した本文" };
    const body = { html: "<p>追記した本文</p>", version: 7 };

    const entry = await addScrapEntry(db, input, body);

    const saved = await db
      .prepare("SELECT body_html, body_html_version FROM scrap_entries WHERE id = ?")
      .bind(entry.id)
      .first();
    expect(saved).toEqual({ body_html: "<p>追記した本文</p>", body_html_version: 7 });
  });

  it("既存投稿の末尾の位置で追記する", async () => {
    await seedScrap();
    await seedEntry({ position: 2 });
    const input = { scrapId: "scrap-id", bodyMarkdown: "追記した本文" };
    const body = { html: "<p>追記した本文</p>", version: 1 };

    const entry = await addScrapEntry(db, input, body);

    const position = await db
      .prepare("SELECT position FROM scrap_entries WHERE id = ?")
      .bind(entry.id)
      .first("position");
    expect(position).toBe(3);
  });
});

describe("cacheScrapEntryHtml", () => {
  it("本文が一致する投稿へHTMLと生成バージョンを保存する", async () => {
    await seedScrap();
    await seedEntry();
    const entry = { id: "entry-id", bodyMarkdown: "本文" };
    const body = { html: "<p>本文</p>", version: 7 };

    await cacheScrapEntryHtml(db, entry, body);

    const saved = await db
      .prepare("SELECT body_html, body_html_version FROM scrap_entries WHERE id = ?")
      .bind(entry.id)
      .first();
    expect(saved).toEqual({ body_html: "<p>本文</p>", body_html_version: 7 });
  });

  it("HTMLの補完でScrapと投稿の更新日時を変更しない", async () => {
    await seedScrap();
    await seedEntry();
    const entry = { id: "entry-id", bodyMarkdown: "本文" };
    const body = { html: "<p>本文</p>", version: 1 };

    await cacheScrapEntryHtml(db, entry, body);

    const dates = await db
      .prepare(`SELECT s.updated_at AS scrap_updated_at, e.updated_at AS entry_updated_at
        FROM scraps s JOIN scrap_entries e ON e.scrap_id = s.id WHERE e.id = ?`)
      .bind(entry.id)
      .first();
    expect(dates).toEqual({ scrap_updated_at: originalDate, entry_updated_at: originalDate });
  });

  it("本文が更新済みの投稿へ古いHTMLを保存しない", async () => {
    await seedScrap();
    await seedEntry({ markdown: "更新後の本文", html: "<p>更新後の本文</p>", version: 2 });
    const entry = { id: "entry-id", bodyMarkdown: "更新前の本文" };
    const body = { html: "<p>更新前の本文</p>", version: 1 };

    await cacheScrapEntryHtml(db, entry, body);

    const saved = await db
      .prepare("SELECT body_html, body_html_version FROM scrap_entries WHERE id = ?")
      .bind(entry.id)
      .first();
    expect(saved).toEqual({ body_html: "<p>更新後の本文</p>", body_html_version: 2 });
  });
});

describe("getScrapById", () => {
  it("保存済みHTMLと生成バージョンを読み込む", async () => {
    await seedScrap();
    await seedEntry({ html: "<p>保存済みの本文</p>", version: 7 });

    const result = await getScrapById(db, "scrap-id");

    expect(result?.entries[0]).toMatchObject({
      bodyHtml: "<p>保存済みの本文</p>",
      bodyHtmlVersion: 7,
    });
  });

  it("ピン留めした投稿を先頭に読み込む", async () => {
    await seedScrap();
    await seedEntry({ html: "<p>通常の投稿</p>", version: 1 });
    await seedEntry({
      id: "pinned-id",
      html: "<p>ピン留め投稿</p>",
      version: 1,
      position: 2,
      pinned: true,
    });

    const result = await getScrapById(db, "scrap-id");

    expect(result?.entries.map((entry) => entry.id)).toEqual(["pinned-id", "entry-id"]);
  });
});

describe("setPinnedScrapEntry", () => {
  it("投稿のピン留め状態を保存する", async () => {
    await seedScrap();
    await seedEntry();

    await setPinnedScrapEntry(db, "scrap-id", "entry-id", true);

    const pinned = await db
      .prepare("SELECT is_pinned FROM scrap_entries WHERE id = 'entry-id'")
      .first("is_pinned");
    expect(pinned).toBe(1);
  });

  it("ピン留めを変更しても投稿の保存済みHTMLを維持する", async () => {
    await seedScrap();
    await seedEntry({ html: "<p>保存済みの本文</p>", version: 1 });

    await setPinnedScrapEntry(db, "scrap-id", "entry-id", true);

    const html = await db
      .prepare("SELECT body_html FROM scrap_entries WHERE id = 'entry-id'")
      .first("body_html");
    expect(html).toBe("<p>保存済みの本文</p>");
  });
});

describe("deleteScrap", () => {
  it("Scrapを削除すると保存済みHTMLを含む投稿も削除する", async () => {
    await seedScrap();
    await seedEntry({ html: "<p>保存済みの本文</p>", version: 1 });

    await deleteScrap(db, "scrap-id");

    const count = await db.prepare("SELECT COUNT(*) AS count FROM scrap_entries").first("count");
    expect(count).toBe(0);
  });
});
