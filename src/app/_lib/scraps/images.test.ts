import { describe, expect, it } from "vitest";
import { getScrapImageExtension, isScrapImageKey } from "./images";

describe("scrap images", () => {
  it.each([
    ["image/gif", "gif"],
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
  ])("maps %s to a safe extension", (contentType, extension) => {
    expect(getScrapImageExtension(contentType)).toBe(extension);
  });

  it("rejects unsupported image types", () => {
    expect(getScrapImageExtension("image/svg+xml")).toBeUndefined();
  });

  it("only accepts generated object keys", () => {
    expect(isScrapImageKey("scraps/2026/09/123e4567-e89b-12d3-a456-426614174000.png")).toBe(true);
    expect(isScrapImageKey("../secret.png")).toBe(false);
  });
});
