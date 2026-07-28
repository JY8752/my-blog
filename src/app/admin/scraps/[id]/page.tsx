import { Blog } from "@/components/Blog";
import { ScrapEntryForm } from "@/components/scraps/ScrapEntryForm";
import { getScrapsDatabase } from "@/lib/scraps/database";
import { renderScrapMarkdown } from "@/lib/scraps/markdown";
import { formatScrapDate } from "@/lib/scraps/presentation";
import { getScrapById } from "@/lib/scraps/repository";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ManageScrapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scrap = await getScrapById(getScrapsDatabase(), id);
  if (!scrap) notFound();

  const entries = await Promise.all(
    scrap.entries.map(async (entry) => ({
      ...entry,
      html: await renderScrapMarkdown(entry.bodyMarkdown),
    })),
  );

  return (
    <section>
      <div>
        <div className="font-label text-label-sm tracking-label text-tertiary uppercase">
          {scrap.entryCount} posts
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.08] font-bold tracking-display">
          {scrap.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {scrap.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-outline-variant px-2.5 py-1 font-label text-label-sm text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/scraps/${scrap.slug}`}
          className="mt-5 inline-flex font-label text-xs text-primary underline underline-offset-4"
        >
          公開ページを開く ↗
        </Link>
      </div>

      <div className="mt-14 max-w-5xl overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-paper">
        <div className="flex items-baseline justify-between gap-5 border-b border-outline-variant bg-surface-container px-5 py-4 sm:px-8">
          <h2 className="font-display text-lg font-semibold">これまでの投稿</h2>
          <span className="font-label text-label-sm text-tertiary">{entries.length} posts</span>
        </div>

        <ol className="divide-y divide-outline-variant">
          {entries.map((entry) => (
            <li key={entry.id} className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="mb-7 flex items-center gap-3 font-label text-label-sm tracking-data text-tertiary">
                <span className="text-primary">POST {String(entry.position).padStart(2, "0")}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-outline-variant" />
                <time dateTime={entry.createdAt}>{formatScrapDate(entry.createdAt)}</time>
              </div>
              <div className="article-content">
                <Blog html={entry.html} />
              </div>
            </li>
          ))}
        </ol>

        <div className="border-t border-outline-variant bg-surface-container px-5 py-8 sm:px-8 sm:py-10">
          <div className="mb-7">
            <p className="font-label text-label-sm tracking-label-wide text-primary uppercase">
              Continue this scrap
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold">続きを書く</h2>
          </div>
          <ScrapEntryForm scrapId={scrap.id} />
        </div>
      </div>
    </section>
  );
}
