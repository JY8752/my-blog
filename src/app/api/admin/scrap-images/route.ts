import { requireAdmin } from "@/app/_lib/scraps/access";
import { getScrapImagesBucket } from "@/app/_lib/scraps/database";
import { apiErrorResponse, assertSameOrigin, RequestError } from "@/app/_lib/scraps/http";
import { getScrapImageExtension, MAX_SCRAP_IMAGE_BYTES } from "@/app/_lib/scraps/images";

export async function POST(request: Request) {
  try {
    await requireAdmin(request.headers);
    assertSameOrigin(request);

    const declaredLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_SCRAP_IMAGE_BYTES + 64 * 1024) {
      throw new RequestError(413, "画像は10MB以下にしてください。");
    }

    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File)) throw new RequestError(400, "画像を選択してください。");
    if (image.size > MAX_SCRAP_IMAGE_BYTES) {
      throw new RequestError(413, "画像は10MB以下にしてください。");
    }

    const extension = getScrapImageExtension(image.type);
    if (!extension) {
      throw new RequestError(415, "JPEG、PNG、GIF、WebP形式の画像を使用してください。");
    }

    const now = new Date();
    const key = `scraps/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${extension}`;
    await getScrapImagesBucket().put(key, image.stream(), {
      httpMetadata: { contentType: image.type },
    });

    return Response.json({ url: `/api/scrap-images/${key}` }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
