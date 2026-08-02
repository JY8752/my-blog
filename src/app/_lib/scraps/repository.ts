import "server-only";

import { ScrapConflictError, ScrapNotFoundError } from "./errors";
import type {
  AddScrapEntryInput,
  CreateScrapInput,
  ScrapDetail,
  ScrapEntry,
  ScrapSummary,
} from "./types";

interface ScrapRow {
  id: string;
  slug: string;
  title: string;
  tags: string;
  created_at: string;
  updated_at: string;
  entry_count: number | string;
}

interface ScrapEntryRow {
  id: string;
  scrap_id: string;
  body_markdown: string;
  position: number;
  created_at: string;
  updated_at: string;
}

function parseTags(value: string): string[] {
  try {
    const tags: unknown = JSON.parse(value);
    return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

function mapScrap(row: ScrapRow): ScrapSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tags: parseTags(row.tags),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    entryCount: Number(row.entry_count),
  };
}

function mapScrapEntry(row: ScrapEntryRow): ScrapEntry {
  return {
    id: row.id,
    scrapId: row.scrap_id,
    bodyMarkdown: row.body_markdown,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const summaryColumns = `
  s.id,
  s.slug,
  s.title,
  s.tags,
  s.created_at,
  s.updated_at,
  COUNT(e.id) AS entry_count
`;

export async function listScraps(db: D1Database): Promise<ScrapSummary[]> {
  const result = await db
    .prepare(
      `
        SELECT ${summaryColumns}
        FROM scraps s
        LEFT JOIN scrap_entries e ON e.scrap_id = s.id
        GROUP BY s.id
        ORDER BY s.updated_at DESC
        LIMIT 200
      `,
    )
    .all<ScrapRow>();

  return result.results.map(mapScrap);
}

async function getScrapDetail(
  db: D1Database,
  column: "id" | "slug",
  value: string,
): Promise<ScrapDetail | null> {
  const scrap = await db
    .prepare(
      `
        SELECT ${summaryColumns}
        FROM scraps s
        LEFT JOIN scrap_entries e ON e.scrap_id = s.id
        WHERE s.${column} = ?
        GROUP BY s.id
      `,
    )
    .bind(value)
    .first<ScrapRow>();

  if (!scrap) return null;

  const entries = await db
    .prepare(
      `
        SELECT id, scrap_id, body_markdown, position, created_at, updated_at
        FROM scrap_entries
        WHERE scrap_id = ?
        ORDER BY position ASC
      `,
    )
    .bind(scrap.id)
    .all<ScrapEntryRow>();

  return {
    ...mapScrap(scrap),
    entries: entries.results.map(mapScrapEntry),
  };
}

export function getScrapBySlug(db: D1Database, slug: string): Promise<ScrapDetail | null> {
  return getScrapDetail(db, "slug", slug);
}

export function getScrapById(db: D1Database, id: string): Promise<ScrapDetail | null> {
  return getScrapDetail(db, "id", id);
}

export async function createScrap(db: D1Database, input: CreateScrapInput): Promise<ScrapDetail> {
  const scrapId = crypto.randomUUID();
  const entryId = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await db.batch([
      db
        .prepare(
          `
            INSERT INTO scraps (id, slug, title, tags, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `,
        )
        .bind(scrapId, input.slug, input.title, JSON.stringify(input.tags), now, now),
      db
        .prepare(
          `
            INSERT INTO scrap_entries
              (id, scrap_id, body_markdown, position, created_at, updated_at)
            VALUES (?, ?, ?, 1, ?, ?)
          `,
        )
        .bind(entryId, scrapId, input.bodyMarkdown, now, now),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed: scraps.slug")) {
      throw new ScrapConflictError();
    }
    throw error;
  }

  const created = await getScrapById(db, scrapId);
  if (!created) throw new ScrapNotFoundError("作成したスクラップを取得できませんでした。");
  return created;
}

export async function addScrapEntry(
  db: D1Database,
  input: AddScrapEntryInput,
): Promise<ScrapEntry> {
  const entryId = crypto.randomUUID();
  const now = new Date().toISOString();

  const [insertResult] = await db.batch([
    db
      .prepare(
        `
          INSERT INTO scrap_entries
            (id, scrap_id, body_markdown, position, created_at, updated_at)
          SELECT
            ?,
            id,
            ?,
            COALESCE(
              (SELECT MAX(position) + 1 FROM scrap_entries WHERE scrap_id = scraps.id),
              1
            ),
            ?,
            ?
          FROM scraps
          WHERE id = ?
        `,
      )
      .bind(entryId, input.bodyMarkdown, now, now, input.scrapId),
    db.prepare("UPDATE scraps SET updated_at = ? WHERE id = ?").bind(now, input.scrapId),
  ]);

  if (Number(insertResult.meta.changes) !== 1) {
    throw new ScrapNotFoundError();
  }

  const entry = await db
    .prepare(
      `
        SELECT id, scrap_id, body_markdown, position, created_at, updated_at
        FROM scrap_entries
        WHERE id = ?
      `,
    )
    .bind(entryId)
    .first<ScrapEntryRow>();

  if (!entry) throw new ScrapNotFoundError("追加した投稿を取得できませんでした。");
  return mapScrapEntry(entry);
}
