import { requireAdmin } from "@/lib/scraps/access";
import { getScrapsDatabase } from "@/lib/scraps/database";
import { apiErrorResponse, assertSameOrigin, readJsonBody } from "@/lib/scraps/http";
import { createScrap } from "@/lib/scraps/repository";
import { parseCreateScrapInput } from "@/lib/scraps/validation";

export async function POST(request: Request) {
  try {
    await requireAdmin(request.headers);
    assertSameOrigin(request);
    const input = parseCreateScrapInput(await readJsonBody(request));
    const scrap = await createScrap(getScrapsDatabase(), input);

    return Response.json({ scrap }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
