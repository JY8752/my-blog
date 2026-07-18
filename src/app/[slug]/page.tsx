import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blog } from "../../components/Blog";
import { BLOG_URL } from "../../consts/message";
import { getAllBlogs } from "../../lib/blog";

import markdownToHtml from "zenn-markdown-html";

export function generateStaticParams() {
  return getAllBlogs().map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = getAllBlogs().find((item) => item.slug === slug);
  if (!blog) return {};
  const ogpImage = `https://ogp-generate.j-y-87524086.workers.dev?msg=${blog.title}`;

  return {
    title: blog.title,
    openGraph: {
      url: `${BLOG_URL}${blog.slug}`,
      title: blog.title,
      images: [ogpImage],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      images: [ogpImage],
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getAllBlogs().find((item) => item.slug === slug);
  if (!blog) notFound();

  const html = await markdownToHtml(blog.body, {
    embedOrigin: "https://embed.zenn.studio",
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 md:py-20 lg:px-8">
      <Link
        href="/#articles"
        className="inline-flex items-center gap-2 rounded-lg font-label text-sm text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
      >
        <span aria-hidden="true">←</span> 記事一覧へ
      </Link>

      <article className="mt-8 overflow-hidden rounded-xl border border-white/8 bg-surface-container shadow-neon-secondary">
        <header className="border-b border-outline-variant/60 bg-surface-container-low px-6 py-9 md:px-12 md:py-12">
          <time
            dateTime={blog.date}
            className="font-label text-sm tracking-[0.06em] text-on-surface-variant"
          >
            {blog.date}
          </time>
          <h1 className="mt-5 text-3xl leading-[1.3] font-extrabold tracking-tight text-balance md:text-5xl">
            {blog.title}
          </h1>
          <div className="mt-7 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-secondary/35 bg-secondary/10 px-3 py-1.5 font-label text-xs font-medium text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div className="article-content px-6 py-9 md:px-12 md:py-12">
          <Blog html={html} />
        </div>
      </article>
    </main>
  );
}
