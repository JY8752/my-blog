import type { Metadata } from "next";
import { ScrapIndex } from "../../components/ScrapIndex";

export const metadata: Metadata = {
  title: "Scraps",
  description: "日々の開発で見つけた断片的な知見や、試行錯誤の記録。",
};

export default function ScrapsPage() {
  return <ScrapIndex />;
}
