import { describe, expect, test } from "vitest";
import {
  parseCreateScrapInput,
  parseMarkdownPreviewInput,
  parseScrapEntryInput,
  ScrapValidationError,
} from "./validation";

describe("parseCreateScrapInput", () => {
  test("入力を正規化する", () => {
    expect(
      parseCreateScrapInput({
        title: " Cloudflare D1を試す ",
        slug: "cloudflare-d1",
        tags: [" Cloudflare ", "D1", "D1"],
        bodyMarkdown: " 最初の投稿 ",
      }),
    ).toEqual({
      title: "Cloudflare D1を試す",
      slug: "cloudflare-d1",
      tags: ["Cloudflare", "D1"],
      bodyMarkdown: "最初の投稿",
    });
  });

  test("日本語タイトルでもfallback slugを生成する", () => {
    const result = parseCreateScrapInput({
      title: "日本語だけのタイトル",
      slug: "",
      tags: [],
      bodyMarkdown: "本文",
    });

    expect(result.slug).toMatch(/^scrap-[a-f0-9]{8}$/);
  });

  test("不正なslugを拒否する", () => {
    expect(() =>
      parseCreateScrapInput({
        title: "Title",
        slug: "Invalid Slug",
        tags: [],
        bodyMarkdown: "本文",
      }),
    ).toThrow(ScrapValidationError);
  });
});

describe("scrap input parsers", () => {
  test("空の投稿本文を拒否する", () => {
    expect(() => parseScrapEntryInput({ bodyMarkdown: "   " })).toThrow(ScrapValidationError);
  });

  test("空のMarkdownプレビューを許可する", () => {
    expect(parseMarkdownPreviewInput({ bodyMarkdown: "" })).toEqual({ bodyMarkdown: "" });
  });
});
