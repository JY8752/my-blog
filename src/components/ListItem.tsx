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
      className={`article-reveal group grid gap-4 border-t border-outline-variant py-8 transition-colors duration-300 hover:border-primary md:grid-cols-12 md:gap-6 ${
        isFeatured ? "md:py-12" : "md:py-9"
      } focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary`}
    >
      <time
        dateTime={date}
        className="font-label text-xs tracking-[0.06em] text-tertiary md:col-span-2 md:pt-1"
      >
        {date}
      </time>
      <div className="md:col-start-3 md:col-span-8">
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
        className="justify-self-end font-label text-lg text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:col-start-12 md:row-start-1"
      >
        ↗
      </span>
    </Link>
  );
}
