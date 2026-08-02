import type { CreateScrapInput } from "./types";

const TITLE_MAX_LENGTH = 100;
const SLUG_MAX_LENGTH = 80;
const TAG_MAX_COUNT = 5;
const TAG_MAX_LENGTH = 30;
export const SCRAP_BODY_MAX_LENGTH = 50_000;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ScrapValidationError extends Error {
  constructor(
    message: string,
    readonly fields: Record<string, string>,
  ) {
    super(message);
    this.name = "ScrapValidationError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ScrapValidationError("入力内容を確認してください。", {
      form: "JSONオブジェクトを送信してください。",
    });
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateBody(value: unknown): string {
  const bodyMarkdown = asString(value);
  if (!bodyMarkdown) {
    throw new ScrapValidationError("投稿本文を入力してください。", {
      bodyMarkdown: "投稿本文を入力してください。",
    });
  }
  if (bodyMarkdown.length > SCRAP_BODY_MAX_LENGTH) {
    throw new ScrapValidationError("投稿本文が長すぎます。", {
      bodyMarkdown: `投稿本文は${SCRAP_BODY_MAX_LENGTH.toLocaleString()}文字以内にしてください。`,
    });
  }
  return bodyMarkdown;
}

function validateTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new ScrapValidationError("タグを確認してください。", {
      tags: "タグは配列で送信してください。",
    });
  }

  const tags = [
    ...new Set(value.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter(Boolean)),
  ];

  if (tags.length > TAG_MAX_COUNT) {
    throw new ScrapValidationError("タグが多すぎます。", {
      tags: `タグは${TAG_MAX_COUNT}個以内にしてください。`,
    });
  }
  if (tags.some((tag) => tag.length > TAG_MAX_LENGTH)) {
    throw new ScrapValidationError("タグが長すぎます。", {
      tags: `タグは1つにつき${TAG_MAX_LENGTH}文字以内にしてください。`,
    });
  }

  return tags;
}

export function createFallbackSlug(): string {
  return `scrap-${crypto.randomUUID().slice(0, 8)}`;
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}

export function parseCreateScrapInput(value: unknown): CreateScrapInput {
  const input = asRecord(value);
  const title = asString(input.title);
  const requestedSlug = asString(input.slug);
  const slug = requestedSlug || slugify(title) || createFallbackSlug();
  const fields: Record<string, string> = {};

  if (!title) fields.title = "タイトルを入力してください。";
  else if (title.length > TITLE_MAX_LENGTH) {
    fields.title = `タイトルは${TITLE_MAX_LENGTH}文字以内にしてください。`;
  }

  if (slug.length > SLUG_MAX_LENGTH || !slugPattern.test(slug)) {
    fields.slug = "slugは英小文字・数字・ハイフンのみで入力してください。";
  }

  if (Object.keys(fields).length > 0) {
    throw new ScrapValidationError("入力内容を確認してください。", fields);
  }

  return {
    title,
    slug,
    tags: validateTags(input.tags),
    bodyMarkdown: validateBody(input.bodyMarkdown),
  };
}

export function parseScrapEntryInput(value: unknown): { bodyMarkdown: string } {
  const input = asRecord(value);
  return { bodyMarkdown: validateBody(input.bodyMarkdown) };
}

export function parseMarkdownPreviewInput(value: unknown): { bodyMarkdown: string } {
  const input = asRecord(value);
  const bodyMarkdown = typeof input.bodyMarkdown === "string" ? input.bodyMarkdown : "";
  if (bodyMarkdown.length > SCRAP_BODY_MAX_LENGTH) {
    throw new ScrapValidationError("投稿本文が長すぎます。", {
      bodyMarkdown: `投稿本文は${SCRAP_BODY_MAX_LENGTH.toLocaleString()}文字以内にしてください。`,
    });
  }
  return { bodyMarkdown };
}
