import Link from "next/link";
import type { Blog } from "../lib/blog";

interface Props {
  blog: Blog;
  index: number;
}

export function ListItem({ blog, index }: Props) {
  const { title, tags, date, slug } = blog;
  const isFeatured = index === 0;

  return (
    <Link
      href={`/${slug}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`article-reveal group grid gap-4 border-t px-3 py-8 transition-[background-color,border-color] duration-300 hover:border-primary hover:bg-surface-container-high md:grid-cols-12 md:gap-6 md:px-4 ${
        isFeatured
          ? "border-primary bg-surface-container md:py-12"
          : "border-outline-variant md:py-9"
      } focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary`}
    >
      <time
        dateTime={date}
        className="font-label text-xs tracking-[0.06em] text-tertiary md:col-span-2 md:pt-1"
      >
        {date}
      </time>
      <div className="md:col-start-3 md:col-span-8">
        {isFeatured && (
          <p className="mb-3 font-label text-[0.625rem] font-medium tracking-[0.08em] text-primary uppercase">
            Latest
          </p>
        )}
        <h3
          className={`font-display leading-[1.2] font-semibold tracking-[-0.025em] text-on-surface text-balance transition-colors group-hover:text-primary ${
            isFeatured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
          }`}
        >
          {title}
        </h3>
        <p className="mt-4 font-label text-xs leading-6 tracking-[0.04em] text-tertiary">
          {tags.join(" · ")}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center justify-self-end rounded-full border border-outline-variant bg-surface-container-lowest font-label text-base text-primary transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-primary md:col-start-12 md:row-start-1"
      >
        ↗
      </span>
    </Link>
  );
}
