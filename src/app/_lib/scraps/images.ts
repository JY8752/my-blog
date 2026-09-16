export const MAX_SCRAP_IMAGE_BYTES = 10 * 1024 * 1024;

const extensionsByContentType = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type ScrapImageContentType = keyof typeof extensionsByContentType;

export function getScrapImageExtension(contentType: string): string | undefined {
  return extensionsByContentType[contentType as ScrapImageContentType];
}

export function isScrapImageKey(value: string): boolean {
  return /^scraps\/[0-9]{4}\/[0-9]{2}\/[a-f0-9-]{36}\.(?:gif|jpe?g|png|webp)$/.test(value);
}
