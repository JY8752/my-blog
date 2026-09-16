import { getScrapImagesBucket } from "@/app/_lib/scraps/database";
import { isScrapImageKey } from "@/app/_lib/scraps/images";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!isScrapImageKey(key)) return new Response(null, { status: 404 });

  const image = await getScrapImagesBucket().get(key);
  if (!image) return new Response(null, { status: 404 });

  const headers = new Headers();
  image.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Content-Disposition", "inline");
  headers.set("X-Content-Type-Options", "nosniff");
  if (image.httpEtag) headers.set("ETag", image.httpEtag);

  return new Response(image.body, { headers });
}
