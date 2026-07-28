import { requireAdmin } from "@/lib/scraps/access";
import { getScrapsDatabase } from "@/lib/scraps/database";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/lib/scraps/http";
import { addScrapEntry } from "@/lib/scraps/repository";
import { parseScrapEntryInput } from "@/lib/scraps/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request.headers);
    assertSameOrigin(request);
    const { id } = await params;
    const input = parseScrapEntryInput(await readJsonBody(request));
    const entry = await addScrapEntry(getScrapsDatabase(), {
      scrapId: id,
      bodyMarkdown: input.bodyMarkdown,
    });

    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
