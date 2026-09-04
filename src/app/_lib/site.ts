export const BLOG_NAME = "ぱんだ.dev";
export const BLOG_URL = "https://jy-panda.com/";

const OGP_IMAGE_URL = "https://ogp-generate.j-y-87524086.workers.dev";

export function getOgpImageUrl(title: string): string {
  return `${OGP_IMAGE_URL}?msg=${encodeURIComponent(title)}`;
}
