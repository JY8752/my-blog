import "server-only";

import { cache } from "react";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { getScrapBySlug } from "@/app/_lib/scraps/repository";

// Share the same database snapshot between metadata and the page for this request.
export const getScrap = cache(async (slug: string) => getScrapBySlug(getScrapsDatabase(), slug));
