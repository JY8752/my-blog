import type { Metadata } from "next";
import Image from "next/image";
import { ListItem } from "../components/ListItem";
import { BLOG_NAME, BLOG_URL } from "../consts/message";
import { getAllBlogs } from "../lib/blog";

export const metadata: Metadata = {
  openGraph: {
    url: BLOG_URL,
    title: BLOG_NAME,
    images: [`${BLOG_URL}Top.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_NAME,
    images: [`${BLOG_URL}Top.png`],
  },
};

export default function Home() {
  const blogs = getAllBlogs();
  return (
    <div className="flex flex-col-reverse justify-center p-10 md:flex-row">
      <div className="w-50">
        {blogs.map((blog) => (
          <ListItem key={blog.slug} blog={blog} />
        ))}
      </div>
      <div className="m-10 whitespace-pre-wrap break-words rounded bg-blue-800 p-5 shadow-sm">
        <Image
          src="/Icon.png"
          alt="アイコン"
          width={200}
          height={200}
          className="mx-auto mt-10 rounded-full"
          priority
        />
        <div className="p-3">
          <p className="text-lg font-semibold">Yamanaka Junichi</p>
          <p>2020年に営業から独学でエンジニアになりました。メインはサーバーサイド。</p>
          <a
            href="https://talks-3l6.pages.dev/"
            className="block text-xl text-gray-400 hover:opacity-50"
          >
            {">"} My Talks
          </a>
        </div>
        <div className="flex flex-col p-3">
          <p className="text-lg font-semibold">言語</p>
          <p>Java/Kotlin/Go/TypeScript/Terraform/</p>
          <p>(Solidity/Cadence/Rust/Python/Ruby/Elm)</p>
        </div>
        <div className="flex flex-col p-3">
          <p className="text-lg font-semibold">フレームワーク</p>
          <p>Spring/React</p>
        </div>
        <div className="flex flex-col p-3">
          <p className="text-lg font-semibold">DB</p>
          <p>MySQL/Mongo/Redis</p>
        </div>
        <div className="flex flex-col p-3">
          <p className="text-lg font-semibold">その他</p>
          <p>Docker/Kubernetes/AWS/GCP/Cloudflare</p>
        </div>
      </div>
    </div>
  );
}
