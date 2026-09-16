"use server";

import { requireAdmin } from "@/app/_lib/scraps/access";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { ScrapNotFoundError } from "@/app/_lib/scraps/errors";
import { setPinnedScrapEntry } from "@/app/_lib/scraps/repository";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface SetPinnedEntryState {
  error: string;
}

export async function setPinnedEntryAction(
  scrapId: string,
  entryId: string,
  isPinned: boolean,
  _previousState: SetPinnedEntryState,
): Promise<SetPinnedEntryState> {
  try {
    await requireAdmin(await headers());
    await setPinnedScrapEntry(getScrapsDatabase(), scrapId, entryId, isPinned);
    revalidatePath(`/admin/scraps/${scrapId}`);
    revalidatePath("/scraps/[slug]", "page");
    return { error: "" };
  } catch (error) {
    return {
      error:
        error instanceof ScrapNotFoundError
          ? error.message
          : "ピン留めを変更できませんでした。時間をおいて再度お試しください。",
    };
  }
}
