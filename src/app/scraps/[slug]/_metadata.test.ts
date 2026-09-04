import { describe, expect, test } from "vitest";
import { createScrapMetadata } from "./_metadata";

describe("createScrapMetadata", () => {
  test("Scrap詳細用のOGPとXカードを生成する", () => {
    const metadata = createScrapMetadata({
      slug: "next-ogp",
      title: "Next.jsでOGPを作る",
    });
    const image =
      "https://ogp-generate.j-y-87524086.workers.dev?msg=Next.js%E3%81%A7OGP%E3%82%92%E4%BD%9C%E3%82%8B";

    expect(metadata).toEqual({
      title: "Next.jsでOGPを作る",
      description: "Next.jsでOGPを作るについての試行錯誤とメモ。",
      openGraph: {
        url: "https://jy-panda.com/scraps/next-ogp",
        title: "Next.jsでOGPを作る",
        images: [image],
      },
      twitter: {
        card: "summary_large_image",
        title: "Next.jsでOGPを作る",
        images: [image],
      },
    });
  });
});
