import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

const skillGroups = [
  { label: "Languages 📚", values: ["Java", "Kotlin", "Go", "TypeScript", "Terraform", "(Rust)"] },
  { label: "Frameworks 🚀", values: ["Spring", "React", "Next.js", "Vue.js"] },
  { label: "Platform 🚧", values: ["AWS", "Google Cloud", "Cloudflare", "(Kubernetes)"] },
  { label: "DB 📦", values: ["PostgreSQL", "MySQL", "Redis", "MongoDB"] },
  {
    label: "Favorite ❤️",
    values: ["Protobuf", "Connect", "gRPC", "Unit Test", "TDD", "DDD", "Clean Architecture"],
  },
];

export default function Home() {
  const blogs = getAllBlogs();

  return (
    <main>
      <section className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8">
        <div className="lg:col-span-7">
          <p className="font-label text-sm font-medium tracking-[0.12em] text-secondary uppercase">
            Backend engineer · HOKKAIDO, JAPAN
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.18] font-extrabold tracking-[-0.03em] text-balance md:text-6xl">
            子どもたちが
            <br />
            <span className="text-primary">寝た</span>あとの
            <span className="text-primary">学び</span>の記録
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-on-surface-variant">
            営業職から独学でエンジニアへ。東京から北海道へ移住し、現在はサーバーサイドを中心に活動するフリーランスエンジニアです。日々の開発で得た学びや、試した技術を記録しています。2児のパパ。
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="#articles"
              className="rounded-lg bg-primary px-6 py-3 font-label text-sm font-bold text-on-primary shadow-neon-primary transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              記事を読む
            </Link>
            <a
              href="https://work.jy-panda.com/"
              className="rounded-lg border border-outline-variant bg-surface-container px-6 py-3 font-label text-sm font-bold text-on-surface transition-all hover:border-secondary/60 hover:text-secondary active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              職務経歴 ↗
            </a>
            <a
              href="https://talk.jy-panda.com/"
              className="rounded-lg border border-outline-variant bg-surface-container px-6 py-3 font-label text-sm font-bold text-on-surface transition-all hover:border-secondary/60 hover:text-secondary active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              My Talks ↗
            </a>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-xl border border-white/8 bg-surface-container p-8 shadow-neon-primary lg:col-span-5">
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-14 h-44 w-44 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-secondary/10 blur-3xl"
          />
          <div className="relative">
            <div className="mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-primary bg-white shadow-neon-primary">
              <Image
                src="/profile-icon.png"
                alt="ぱんだのプロフィールイラスト"
                width={460}
                height={460}
                className="h-full w-full object-contain object-center"
                priority
              />
            </div>
            <div className="mt-7 text-center">
              <p className="text-2xl font-bold tracking-[-0.02em]">Yamanaka Junichi</p>
              <p className="mt-2 font-label text-sm text-secondary">SERVER-SIDE DEVELOPER</p>
            </div>
            <div className="mt-8 space-y-5 border-t border-outline-variant/60 pt-7">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="font-label text-xs tracking-widest text-on-surface-variant uppercase">
                    {group.label}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.values.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-secondary/30 bg-secondary/10 px-2.5 py-1 font-label text-xs text-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section
        id="articles"
        className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-16 md:py-24 lg:px-8"
      >
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="font-label text-sm tracking-[0.12em] text-secondary uppercase">
              Latest writing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] md:text-4xl">記事一覧</h2>
          </div>
          <p className="hidden font-label text-sm text-on-surface-variant sm:block">
            {String(blogs.length).padStart(2, "0")} ARTICLES
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {blogs.map((blog) => (
            <ListItem key={blog.slug} blog={blog} />
          ))}
        </div>
      </section>
    </main>
  );
}
