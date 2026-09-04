import type { Metadata } from "next";
import { BLOG_URL, getOgpImageUrl } from "../../_lib/site";

export function createScrapMetadata({ slug, title }: { slug: string; title: string }): Metadata {
  const ogpImage = getOgpImageUrl(title);

  return {
    title,
    description: `${title}についての試行錯誤とメモ。`,
    openGraph: {
      url: `${BLOG_URL}scraps/${slug}`,
      title,
      images: [ogpImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogpImage],
    },
  };
}
