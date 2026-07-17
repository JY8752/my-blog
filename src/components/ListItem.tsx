import Link from "next/link";
import type { Blog } from "../lib/blog";

interface Props {
  blog: Blog;
}

export function ListItem({ blog }: Props) {
  const { title, tags, date, slug } = blog;
  return (
    <Link href={`/${slug}`} className="block border-b border-purple-400 p-3 hover:opacity-50">
      <div>{date}</div>
      <div className="mt-2 wrap-break-word text-2xl font-semibold">{title}</div>
      <div className="flex flex-wrap">
        {tags.map((t) => (
          <div
            key={t}
            className="mr-2 mt-2 rounded-full bg-blue-800 px-3 py-1 text-sm font-semibold"
          >
            {t}
          </div>
        ))}
      </div>
    </Link>
  );
}
