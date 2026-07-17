# プロジェクトドキュメント

## 概要

個人プロフィール兼ブログサイトです。Next.js + React + Tailwind CSS で構築しています。
ブログ記事は Zenn の Markdown 記法で記述します。

公開 URL: <https://jy-panda.com/>

## 技術スタック

| Layer | Tech |
| --- | --- |
| Package manager | Bun |
| Framework | Next.js |
| UI | React, Tailwind CSS |
| Markdown | zenn-markdown-html, zenn-content-css |
| OGP | Cloudflare Workers (`cloudflare/workers/ogp-generate/`) |
| Analytics notifications | GCP Cloud Functions (`gcp/functions/`) |

## ディレクトリ構成

```text
src/
  app/
    page.tsx       # トップページ（プロフィール + 記事一覧）
    [slug]/
      page.tsx     # 記事詳細ページ
  components/
    Blog.tsx       # ブログ記事描画用の React コンポーネント
    ListItem.tsx
  content/
    blog/          # ブログ記事の Markdown ファイル
  generated/
    blogs.json     # 生成されたブログデータ
  lib/
    blog.ts        # ブログデータ取得ヘルパー
  consts/
    message.ts     # `BLOG_NAME`、`BLOG_URL` などの定数
public/            # 静的アセット（アイコン、画像）
```

## 開発コマンド

```bash
bun run dev      # 開発サーバーを起動
bun run build    # Next.js の本番ビルド
bun run preview  # Cloudflare 用にビルドして preview
bun run check    # code check + Markdown lint
bun run lint:md  # Markdown ファイルの lint
```

## エージェント運用ルール

- Markdown ファイル（`*.md`）を新規作成または編集した場合は、作業完了前に必ず `bun run lint:md -- <changed-files>` を実行する。
- 変更した Markdown ファイルが多い場合、または対象ファイルがはっきりしない場合は `bun run lint:md` を実行する。

## ブログ記事の追加

`src/content/blog/` 配下に Markdown ファイルを作成します。ファイル名がそのまま URL の slug になります。

Frontmatter のスキーマ（すべて必須）:

```markdown
---
title: "記事タイトル"      # string, 1–100 chars
tags: ["tech"]            # array of strings, 1–5 items
date: "2024-01-15"        # YYYY-MM-DD
---

記事本文（Zenn Markdown記法）
```

トップページでは `date` の降順で記事を表示します。

## 主要な規約

- Zenn Markdown 記法を利用できます（コードブロック、メッセージボックス、リンク埋め込みなど）。
- CMS は使わず、すべてのコンテンツをリポジトリ内の Markdown ファイルで管理します。
- スタイリングは Tailwind の utility class を使います。
- サイト全体で使う定数（名前、URL など）は `src/consts/message.ts` にまとめます。
- `src/app/[slug]/page.tsx` では `generateStaticParams()` を使い、静的ページを生成します。
