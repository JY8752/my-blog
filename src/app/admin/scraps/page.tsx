import { getScrapsDatabase } from "@/lib/scraps/database";
import { formatScrapDate } from "@/lib/scraps/presentation";
import { listScraps } from "@/lib/scraps/repository";
import Link from "next/link";

export default async function ScrapsAdminPage() {
  const scraps = await listScraps(getScrapsDatabase());

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-label text-[0.6875rem] tracking-[0.08em] text-tertiary uppercase">
            Private workspace
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-none font-bold tracking-[-0.035em]">
            Scraps
          </h1>
        </div>
        <p className="font-label text-xs text-tertiary">{scraps.length} scraps</p>
      </div>

      {scraps.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-outline-variant p-10 text-center">
          <p className="font-display text-xl font-semibold">まだスクラップがありません</p>
          <Link
            href="/admin/scraps/new"
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-label text-xs font-bold text-on-primary"
          >
            最初のスクラップを作成
          </Link>
        </div>
      ) : (
        <ul className="mt-12 divide-y divide-outline-variant border-y border-outline-variant">
          {scraps.map((scrap) => (
            <li key={scrap.id}>
              <Link
                href={`/admin/scraps/${scrap.id}`}
                className="group grid gap-4 px-3 py-6 transition-colors hover:bg-surface-container md:grid-cols-[1fr_auto] md:items-center md:px-5"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 font-label text-[0.6875rem] text-tertiary">
                    <span>{scrap.entryCount} posts</span>
                    <time dateTime={scrap.updatedAt}>{formatScrapDate(scrap.updatedAt)}</time>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-semibold transition-colors group-hover:text-primary">
                    {scrap.title}
                  </h2>
                  <p className="mt-2 font-mono text-xs text-tertiary">/{scrap.slug}</p>
                </div>
                <span aria-hidden="true" className="text-tertiary group-hover:text-primary">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
