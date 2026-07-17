# My Blog

個人プロフィール兼ブログサイトです。Next.js + React + Tailwind CSS で構築しています。
ブログ記事は Zenn の Markdown 記法で `src/content/blog/` に置きます。

## Setup

```bash
npm install
```

## Commands

```bash
npm run dev        # 開発サーバーを起動
npm run build      # Next.js の本番ビルド
npm run start      # Next.js の本番サーバーを起動
npm run preview    # Cloudflare 用にビルドしてローカル preview
npm run deploy     # Cloudflare 用にビルドして deploy
npm run check      # code check + Markdown lint
npm run fix        # code check の自動修正
npm run lint:md    # Markdown lint
```

ブログ記事を作成する場合:

```bash
task new:article
```

## Blog Data

`npm run dev` と `npm run build` の前に `src/generated/blogs.json` を自動生成します。

![architecture](doc/architecture.png)
