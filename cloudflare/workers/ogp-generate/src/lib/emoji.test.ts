import { afterEach, describe, expect, it, vi } from "vitest";
import { getTwemojiCodePoint, loadEmoji } from "./emoji";

describe("getTwemojiCodePoint", () => {
  it("converts a single emoji to a Twemoji code point", () => {
    expect(getTwemojiCodePoint("🐼")).toBe("1f43c");
  });

  it("supports emoji sequences and removes variation selectors", () => {
    expect(getTwemojiCodePoint("👨‍💻")).toBe("1f468-200d-1f4bb");
    expect(getTwemojiCodePoint("❤️")).toBe("2764");
  });
});

describe("loadEmoji", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the corresponding Twemoji SVG as an embedded data URL", async () => {
    const svg = "<svg></svg>";
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(svg));

    await expect(loadEmoji("🐼")).resolves.toBe(
      `data:image/svg+xml;base64,${btoa(svg)}`,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/twitter/twemoji/v14.0.2/assets/svg/1f43c.svg",
    );
  });

  it("throws when the Twemoji asset cannot be loaded", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    await expect(loadEmoji("🐼")).rejects.toThrow(
      "Could not load emoji: 1f43c",
    );
  });
});
