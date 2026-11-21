import { requireAdmin } from "@/app/_lib/scraps/access";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { renderScrapBody } from "@/app/_lib/scraps/entry-html";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/app/_lib/scraps/http";
import { createScrap } from "@/app/_lib/scraps/repository";
import { parseCreateScrapInput } from "@/app/_lib/scraps/validation";

export async function POST(request: Request) {
  try {
    await requireAdmin(request.headers);
    assertSameOrigin(request);
    const input = parseCreateScrapInput(await readJsonBody(request));
    const body = await renderScrapBody(input.bodyMarkdown);
    const scrap = await createScrap(getScrapsDatabase(), input, body);

    return Response.json({ scrap }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
