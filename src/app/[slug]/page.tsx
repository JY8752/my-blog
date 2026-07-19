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
    <main className="mx-auto min-h-[70dvh] max-w-[1280px] px-5 py-12 md:px-8 md:py-24 lg:pb-32">
      <Link
        href="/#articles"
        className="inline-flex items-center gap-2 font-label text-xs font-medium text-primary underline decoration-primary underline-offset-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
      >
        <span aria-hidden="true">←</span> 記事一覧へ
      </Link>

      <article className="mt-14 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-x-8 md:gap-y-12">
        <aside className="md:col-span-2 md:row-span-2 md:pt-2">
          <time
            dateTime={blog.date}
            className="block font-label text-xs tracking-[0.06em] text-tertiary"
          >
            {blog.date}
          </time>
          <p className="mt-3 font-label text-xs leading-6 tracking-[0.04em] text-tertiary">
            {blog.tags.join(" · ")}
          </p>
        </aside>

        <header className="md:col-start-4 md:col-span-7">
          <h1 className="max-w-[18ch] font-display text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[1.12] font-bold tracking-[-0.035em] text-balance">
            {blog.title}
          </h1>
        </header>

        <div className="article-content border-t border-outline-variant pt-9 md:col-start-4 md:col-span-7 md:pt-12">
          <Blog html={html} />
        </div>
      </article>
    </main>
  );
}
