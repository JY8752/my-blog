import { requireAdmin } from "@/lib/scraps/access";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/lib/scraps/http";
import { renderScrapMarkdown } from "@/lib/scraps/markdown";
import { parseMarkdownPreviewInput } from "@/lib/scraps/validation";

export async function POST(request: Request) {
  try {
    await requireAdmin(request.headers);
    assertSameOrigin(request);
    const { bodyMarkdown } = parseMarkdownPreviewInput(await readJsonBody(request));
    const html = await renderScrapMarkdown(bodyMarkdown);

    return Response.json(
      { html },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
