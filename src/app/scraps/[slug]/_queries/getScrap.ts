import "server-only";

import { cache } from "react";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { getScrapBySlug } from "@/app/_lib/scraps/repository";

// メタデータと本文で同じリクエスト内のDB取得結果を共有する。
export const getScrap = cache(async (slug: string) => getScrapBySlug(getScrapsDatabase(), slug));
