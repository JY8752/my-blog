"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Scrap {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

const scraps: Scrap[] = [
  {
    slug: "aerospace-introduction",
    title: "Aerospace導入",
    date: "2023.11.20",
    tags: ["macOS", "aerospace", "wm"],
  },
  {
    slug: "go-1-22-routing-enhancements",
    title: "Go 1.22 routing enhancements",
    date: "2023.11.15",
    tags: ["go", "backend"],
  },
  {
    slug: "postgres-query-optimization-notes",
    title: "Postgres query optimization notes",
    date: "2023.10.30",
    tags: ["postgres", "sql", "performance"],
  },
  {
    slug: "setting-up-neovim-for-rust",
    title: "Setting up Neovim for Rust",
    date: "2023.10.12",
    tags: ["neovim", "rust", "lsp"],
  },
  {
    slug: "docker-multi-stage-build-patterns",
    title: "Docker multi-stage build patterns",
    date: "2023.09.05",
    tags: ["docker", "devops"],
  },
];

function ScrapTags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="タグ">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-sm border border-outline-variant bg-surface-container-lowest px-2 py-1 font-label text-[0.6875rem] leading-4 text-on-surface-variant"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

function FeaturedScrap({ scrap }: { scrap: Scrap }) {
  return (
    <Link
      href={`/scraps/${scrap.slug}`}
      className="group block border-l-2 border-primary bg-surface-container p-6 transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary md:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <time
          dateTime={scrap.date.replaceAll(".", "-")}
          className="font-label text-xs text-tertiary"
        >
          {scrap.date}
        </time>
        <span
          aria-hidden="true"
          className="font-label text-lg text-tertiary transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
        >
          ↗
        </span>
      </div>
      <h2 className="mt-4 font-display text-[clamp(2rem,3.4vw,2.375rem)] leading-[1.16] font-semibold tracking-[-0.03em] text-on-surface transition-colors group-hover:text-primary">
        {scrap.title}
      </h2>
      <div className="mt-6">
        <ScrapTags tags={scrap.tags} />
      </div>
    </Link>
  );
}

function ScrapRow({ scrap, index }: { scrap: Scrap; index: number }) {
  return (
    <Link
      href={`/scraps/${scrap.slug}`}
      style={{ animationDelay: `${index * 50}ms` }}
      className="scrap-reveal group block border-t border-outline-variant px-4 py-6 transition-colors hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary md:py-7"
    >
      <div className="flex items-start justify-between gap-4">
        <time
          dateTime={scrap.date.replaceAll(".", "-")}
          className="font-label text-xs text-tertiary"
        >
          {scrap.date}
        </time>
        <span
          aria-hidden="true"
          className="font-label text-base text-tertiary transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
        >
          ↗
        </span>
      </div>
      <h2 className="mt-3 font-display text-2xl leading-[1.24] font-semibold tracking-[-0.02em] text-on-surface transition-colors group-hover:text-primary md:text-[1.625rem]">
        {scrap.title}
      </h2>
      <div className="mt-4">
        <ScrapTags tags={scrap.tags} />
      </div>
    </Link>
  );
}

export function ScrapIndex() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredScraps = useMemo(
    () =>
      normalizedQuery.length === 0
        ? scraps
        : scraps.filter((scrap) =>
            [scrap.title, scrap.date, ...scrap.tags]
              .join(" ")
              .toLocaleLowerCase()
              .includes(normalizedQuery),
          ),
    [normalizedQuery],
  );
  const isSearching = normalizedQuery.length > 0;

  return (
    <main className="mx-auto min-h-[calc(100dvh-4.5rem)] w-full max-w-[1280px] px-5 py-[clamp(4.5rem,9vw,8rem)] md:px-8">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-x-8">
        <aside className="lg:sticky lg:top-28 lg:col-span-4">
          <div aria-hidden="true" className="h-0.5 w-12 bg-primary" />
          <h1 className="mt-6 font-display text-[clamp(3rem,6vw,5rem)] leading-[1.04] font-bold tracking-[-0.035em]">
            Scraps
          </h1>
          <p className="mt-6 max-w-[34ch] text-base leading-[1.8] text-on-surface-variant md:text-[1.0625rem]">
            日々の開発で見つけた断片的な知見や、試行錯誤の記録。
          </p>
          <div className="relative mt-8 max-w-md">
            <label htmlFor="scrap-search" className="sr-only">
              スクラップを検索
            </label>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 fill-none stroke-tertiary"
              strokeWidth="1.8"
            >
              <circle cx="10.8" cy="10.8" r="6.3" />
              <path d="m15.5 15.5 4 4" strokeLinecap="round" />
            </svg>
            <input
              id="scrap-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="スクラップを検索"
              className="min-h-11 w-full rounded-md border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-10 text-sm outline-none transition-shadow placeholder:text-tertiary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
            />
          </div>
        </aside>

        <div aria-hidden="true" className="hidden lg:col-span-1 lg:block" />

        <section aria-label="スクラップ一覧" className="lg:col-span-7">
          {filteredScraps.length === 0 ? (
            <div className="border-y border-outline-variant py-16 text-center">
              <p className="font-display text-xl font-semibold">該当するスクラップはありません</p>
              <p className="mt-2 text-sm text-on-surface-variant">検索語を変えてお試しください。</p>
            </div>
          ) : isSearching ? (
            <div className="border-b border-outline-variant">
              {filteredScraps.map((scrap, index) => (
                <ScrapRow key={scrap.slug} scrap={scrap} index={index} />
              ))}
            </div>
          ) : (
            <>
              <FeaturedScrap scrap={filteredScraps[0]} />
              <div className="mt-8 border-b border-outline-variant">
                {filteredScraps.slice(1).map((scrap, index) => (
                  <ScrapRow key={scrap.slug} scrap={scrap} index={index} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
