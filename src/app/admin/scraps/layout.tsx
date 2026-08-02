import { requireAdmin } from "@/app/_lib/scraps/access";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ScrapsAdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin(await headers());
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto min-h-[calc(100dvh-4.5rem)] w-full max-w-editorial px-5 py-10 md:px-8 md:py-16">
      <nav
        aria-label="スクラップ管理"
        className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-5"
      >
        <Link
          href="/admin/scraps"
          className="font-display text-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
        >
          Scraps Admin
        </Link>
        <div className="flex items-center gap-5 font-label text-xs">
          <Link
            href="/scraps"
            className="text-on-surface-variant underline decoration-outline underline-offset-4 hover:text-primary"
          >
            公開画面
          </Link>
          <Link
            href="/admin/scraps/new"
            className="rounded-md bg-primary px-4 py-3 font-bold text-on-primary hover:bg-primary-fixed-dim"
          >
            新規作成
          </Link>
        </div>
      </nav>
      {children}
    </main>
  );
}
