import { requireAdmin } from "@/app/_lib/scraps/access";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { apiErrorResponse, assertSameOrigin } from "@/app/_lib/scraps/http";
import { deleteScrap } from "@/app/_lib/scraps/repository";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request.headers);
    assertSameOrigin(request);
    const { id } = await params;
    await deleteScrap(getScrapsDatabase(), id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
