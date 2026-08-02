import type { Metadata } from "next";
import { getScrapsDatabase } from "@/app/_lib/scraps/database";
import { listScraps } from "@/app/_lib/scraps/repository";
import { ScrapIndex } from "@/app/scraps/_components/ScrapIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scraps",
  description: "日々の開発で見つけた断片的な知見や、試行錯誤の記録。",
};

export default async function ScrapsPage() {
  const scraps = await listScraps(getScrapsDatabase());
  return <ScrapIndex scraps={scraps} />;
}
