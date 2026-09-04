import { describe, expect, test } from "vitest";
import { getOgpImageUrl } from "./site";

describe("getOgpImageUrl", () => {
  test("タイトルを安全にURLエンコードする", () => {
    expect(getOgpImageUrl("Next.js & OGP? 日本語/#title")).toBe(
      "https://ogp-generate.j-y-87524086.workers.dev?msg=Next.js%20%26%20OGP%3F%20%E6%97%A5%E6%9C%AC%E8%AA%9E%2F%23title",
    );
  });
});
