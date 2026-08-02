import { requireAdmin } from "@/app/_lib/scraps/access";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/app/_lib/scraps/http";
import { renderScrapMarkdown } from "@/app/_lib/scraps/markdown";
import { parseMarkdownPreviewInput } from "@/app/_lib/scraps/validation";

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
