import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blog } from "../../../components/Blog";
import { getScrapsDatabase } from "../../../lib/scraps/database";
import { renderScrapMarkdown } from "../../../lib/scraps/markdown";
import { formatScrapDate } from "../../../lib/scraps/presentation";
import { getScrapBySlug } from "../../../lib/scraps/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scrap = await getScrapBySlug(getScrapsDatabase(), slug);

  if (!scrap) return {};

  return {
    title: scrap.title,
    description: `${scrap.title}についての試行錯誤とメモ。`,
  };
}

export default async function ScrapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scrap = await getScrapBySlug(getScrapsDatabase(), slug);
  if (!scrap) notFound();

  const entries = await Promise.all(
    scrap.entries.map(async (entry) => ({
      ...entry,
      html: await renderScrapMarkdown(entry.bodyMarkdown),
    })),
  );

  return (
    <main className="mx-auto min-h-[calc(100dvh-4.5rem)] w-full max-w-editorial px-5 py-12 md:px-8 md:py-24">
      <Link
        href="/scraps"
        className="inline-flex items-center gap-2 font-label text-xs font-medium text-primary underline decoration-primary underline-offset-4 transition-transform duration-300 ease-editorial hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
      >
        <span aria-hidden="true">←</span> スクラップ一覧へ
      </Link>

      <article className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <header className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <div aria-hidden="true" className="h-0.5 w-12 bg-primary" />
          <div className="mt-6 flex flex-wrap items-center gap-3 font-label text-label-sm tracking-label text-tertiary uppercase">
            <span>
              {scrap.entryCount} {scrap.entryCount === 1 ? "post" : "posts"}
            </span>
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-[1.08] font-bold tracking-display text-balance">
            {scrap.title}
          </h1>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="タグ">
            {scrap.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-sm border border-outline-variant bg-surface-container-lowest px-2.5 py-1 font-label text-label-sm leading-5 text-on-surface-variant"
              >
                {tag}
              </li>
            ))}
          </ul>
          <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-outline-variant pt-5 font-label text-label-sm text-tertiary lg:grid-cols-1">
            <div>
              <dt className="tracking-label uppercase">Created</dt>
              <dd className="mt-1 text-on-surface-variant">
                <time dateTime={scrap.createdAt}>{formatScrapDate(scrap.createdAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="tracking-label uppercase">Updated</dt>
              <dd className="mt-1 text-on-surface-variant">
                <time dateTime={scrap.updatedAt}>{formatScrapDate(scrap.updatedAt)}</time>
              </dd>
            </div>
          </dl>
        </header>

        <div className="lg:col-start-6 lg:col-span-7">
          <ol className="space-y-10">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5 shadow-paper sm:p-8"
              >
                <div className="mb-7 flex items-center justify-between gap-4 border-b border-outline-variant pb-4 font-label text-label-sm text-tertiary">
                  <span>#{entry.position}</span>
                  <time dateTime={entry.createdAt}>{formatScrapDate(entry.createdAt)}</time>
                </div>
                <div className="article-content">
                  <Blog html={entry.html} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </article>
    </main>
  );
}
