import type { Metadata } from "next";
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
  const blog = getAllBlogs().find((b) => b.slug === slug);
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
  const blog = getAllBlogs().find((b) => b.slug === slug);
  if (!blog) notFound();

  const html = await markdownToHtml(blog.body, {
    embedOrigin: "https://embed.zenn.studio",
  });

  return (
    <div className="m-auto max-w-3xl p-10">
      <div className="mb-10 border-b-2 border-purple-400 pb-5">
        <div>{blog.date}</div>
        <h1 className="text-4xl font-bold">{blog.title}</h1>
        <div className="flex flex-wrap">
          {blog.tags.map((t) => (
            <div
              key={t}
              className="mr-2 mt-2 rounded-full bg-blue-800 px-3 py-1 text-sm font-semibold"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
      <Blog html={html} />
    </div>
  );
}
