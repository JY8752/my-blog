# My Blog

個人プロフィール兼ブログサイトです。Next.js + React + Tailwind CSS で構築しています。
ブログ記事は Zenn の Markdown 記法で `src/content/blog/` に置きます。

## Setup

```bash
bun install
```

## Commands

```bash
bun run dev        # 開発サーバーを起動
bun run build      # Next.js の本番ビルド
bun run start      # Next.js の本番サーバーを起動
bun run preview    # Cloudflare 用にビルドしてローカル preview
bun run deploy     # Cloudflare 用にビルドして deploy
bun run check      # code check + Markdown lint
bun run fix        # code check の自動修正
bun run lint:md    # Markdown lint
```

ブログ記事を作成する場合:

```bash
task new:article
```

## Blog Data

`bun run dev` と `bun run build` の前に `src/generated/blogs.json` を自動生成します。

![architecture](doc/architecture.png)
