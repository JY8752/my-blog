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
  { label: "Languages", values: ["Java", "Kotlin", "Go", "TypeScript", "Terraform", "(Rust)"] },
  { label: "Frameworks", values: ["Spring", "React", "Next.js", "Vue.js"] },
  { label: "Platform", values: ["AWS", "Google Cloud", "Cloudflare", "(Kubernetes)"] },
  { label: "Database", values: ["PostgreSQL", "MySQL", "Redis", "MongoDB"] },
  {
    label: "Practices",
    values: ["Protobuf", "Connect", "gRPC", "Unit Test", "TDD", "DDD", "Clean Architecture"],
  },
];

export default function Home() {
  const blogs = getAllBlogs();

  return (
    <main>
      <section className="mx-auto grid max-w-[1280px] gap-16 px-5 py-[clamp(4.5rem,9vw,8rem)] md:px-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <p className="font-label text-xs font-medium tracking-[0.08em] text-tertiary uppercase">
            Backend engineer · HOKKAIDO, JAPAN
          </p>
          <h1 className="mt-8 max-w-4xl font-display text-[clamp(3.25rem,7.2vw,5.75rem)] leading-[1.06] font-bold tracking-[-0.035em] text-balance">
            <span className="block">子どもたちが</span>
            <span className="mt-1 block md:mt-2">
              <span className="text-primary">寝た</span>あとの
            </span>
            <span className="block">
              <span className="text-primary">学び</span>の記録
            </span>
          </h1>
          <p className="mt-8 max-w-[65ch] border-l-2 border-primary pl-5 text-base leading-[1.85] text-on-surface-variant md:mt-10 md:pl-6 md:text-[1.0625rem]">
            営業職から独学でエンジニアへ。東京から北海道へ移住し、現在はサーバーサイドを中心に活動するフリーランスエンジニアです。日々の開発で得た学びや、試した技術を記録しています。2児のパパ。
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link
              href="#articles"
              className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-label text-xs font-bold tracking-[0.04em] text-on-primary transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary-fixed-dim active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
            >
              記事を読む
            </Link>
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              <span
                aria-disabled="true"
                title="準備中"
                className="cursor-not-allowed font-label text-xs font-medium text-on-surface-variant opacity-50"
              >
                Scraps（準備中）
              </span>
              <a
                href="https://work.jy-panda.com/"
                className="font-label text-xs font-medium text-on-surface underline decoration-outline underline-offset-4 transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0.5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
              >
                職務経歴 ↗
              </a>
              <a
                href="https://talk.jy-panda.com/"
                className="font-label text-xs font-medium text-on-surface underline decoration-outline underline-offset-4 transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0.5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
              >
                My Talks ↗
              </a>
            </div>
          </div>
        </div>

        <aside className="lg:col-start-9 lg:col-span-4 lg:pt-7">
          <div className="rounded-lg border border-outline-variant bg-surface-container p-5 shadow-paper sm:p-7">
            <div className="flex flex-col items-center text-center">
              <div className="profile-float h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-surface-container-lowest p-1 lg:h-28 lg:w-28">
                <Image
                  src="/profile-icon.png"
                  alt="ぱんだのプロフィールイラスト"
                  width={460}
                  height={460}
                  className="h-full w-full rounded-full object-contain object-center"
                />
              </div>
              <div className="mt-6">
                <p className="font-display text-xl font-semibold tracking-tight lg:text-2xl">
                  Yamanaka Junichi
                </p>
                <p className="mt-2 font-label text-[0.6875rem] leading-5 tracking-[0.06em] text-tertiary">
                  SERVER-SIDE DEVELOPER
                </p>
              </div>
            </div>

            <div className="mt-8 border-b border-outline-variant pb-3">
              <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Skills</h2>
            </div>

            <dl className="divide-y divide-outline-variant">
              {skillGroups.map((group) => (
                <div key={group.label} className="py-5">
                  <dt className="font-label text-[0.6875rem] tracking-[0.06em] text-tertiary">
                    {group.label}
                  </dt>
                  <dd className="mt-3">
                    <ul className="flex flex-wrap gap-2" aria-label={`${group.label}のスキル`}>
                      {group.values.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-sm border border-outline-variant bg-surface-container-lowest px-2.5 py-1 font-label text-[0.6875rem] leading-5 text-on-surface-variant"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      <section
        id="articles"
        className="scroll-mt-24 border-y border-outline-variant bg-surface-container-low"
      >
        <div className="mx-auto max-w-[1280px] px-5 py-[clamp(4.5rem,9vw,8rem)] md:px-8">
          <div className="mb-12 grid items-end gap-6 md:mb-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="font-label text-xs tracking-[0.08em] text-tertiary uppercase">
                Latest writing
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.18] font-bold tracking-[-0.03em]">
                記事一覧
              </h2>
            </div>
            <p className="font-label text-xs tracking-[0.06em] text-tertiary md:col-start-11 md:col-span-2 md:text-right">
              {String(blogs.length).padStart(2, "0")} ARTICLES
            </p>
          </div>
          <div>
            {blogs.map((blog, index) => (
              <ListItem key={blog.slug} blog={blog} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
