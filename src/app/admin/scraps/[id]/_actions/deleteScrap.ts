"use server";

import { requireAdmin } from "@/app/_lib/scraps/access";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { ScrapNotFoundError } from "@/app/_lib/scraps/errors";
import { deleteScrap } from "@/app/_lib/scraps/repository";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface DeleteScrapState {
  error: string;
}

export async function deleteScrapAction(
  scrapId: string,
  _previousState: DeleteScrapState,
): Promise<DeleteScrapState> {
  try {
    await requireAdmin(await headers());
    await deleteScrap(getScrapsDatabase(), scrapId);
  } catch (error) {
    return {
      error:
        error instanceof ScrapNotFoundError
          ? error.message
          : "スクラップを削除できませんでした。時間をおいて再度お試しください。",
    };
  }

  redirect("/admin/scraps");
}
