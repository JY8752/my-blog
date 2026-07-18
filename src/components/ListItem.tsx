import Link from "next/link";
import type { Blog } from "../lib/blog";

interface Props {
  blog: Blog;
}

export function ListItem({ blog }: Props) {
  const { title, tags, date, slug } = blog;

  return (
    <Link
      href={`/${slug}`}
      className="group flex min-h-64 flex-col rounded-xl border border-white/8 bg-surface-container p-8 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-neon-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
    >
      <div className="flex items-center justify-between gap-4">
        <time
          dateTime={date}
          className="font-label text-sm tracking-[0.04em] text-on-surface-variant"
        >
          {date}
        </time>
        <span
          aria-hidden="true"
          className="grid h-9 w-9 place-items-center rounded-full bg-surface-container-high text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        >
          ↗
        </span>
      </div>
      <h3 className="mt-7 text-2xl leading-[1.4] font-bold tracking-[-0.02em] text-on-surface text-balance">
        {title}
      </h3>
      <div className="mt-auto flex flex-wrap gap-2 pt-8">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-secondary/35 bg-secondary/10 px-3 py-1.5 font-label text-xs font-medium text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
