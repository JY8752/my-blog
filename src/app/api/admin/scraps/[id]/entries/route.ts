import { requireAdmin } from "@/app/_lib/scraps/access";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { renderScrapBody } from "@/app/_lib/scraps/entry-html";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/app/_lib/scraps/http";
import { addScrapEntry } from "@/app/_lib/scraps/repository";
import { parseScrapEntryInput } from "@/app/_lib/scraps/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request.headers);
    assertSameOrigin(request);
    const { id } = await params;
    const input = parseScrapEntryInput(await readJsonBody(request));
    const body = await renderScrapBody(input.bodyMarkdown);
    const entry = await addScrapEntry(
      getScrapsDatabase(),
      { scrapId: id, bodyMarkdown: input.bodyMarkdown },
      body,
    );

    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
