# ぱんだ.dev

[ぱんだ.dev](https://jy-panda.com/)のソースコードです。
プロフィールと、日々の開発で得た学びをまとめる技術ブログを提供しています。

ブログ記事はリポジトリ内のMarkdownで管理し、Next.jsの静的ページとして生成します。
本番環境はOpenNextを介してCloudflare Workersへデプロイします。

## 主な機能

* プロフィールと技術スタックの表示
* 投稿日順のブログ記事一覧
* Markdownから生成するブログ記事詳細ページ
* Zenn Markdown記法によるコードブロック、メッセージ、埋め込み表示
* D1に保存する時系列形式のスクラップ
* Cloudflare Accessで保護したスクラップ管理画面
* 記事ごとのOGP／Xカード設定
* light／darkテーマとレスポンシブ表示

## 使用技術

| 分類 | 技術 |
| --- | --- |
| 開発ツール・タスク管理 | mise |
| パッケージ管理 | Bun（メイン）、npm（OGP Worker） |
| Web | Next.js（App Router）、React、TypeScript |
| スタイリング | Tailwind CSS、PostCSS、next/font |
| コンテンツ | Markdown、gray-matter、zenn-markdown-html、zenn-content-css |
| ホスティング・データ | Cloudflare Workers、D1、Access、OpenNext、Wrangler |
| コード品質 | Vite+、Vitest、markdownlint |
| OGP生成 | Cloudflare Workers、Satori、resvg-wasm |
| 分析通知 | Google Cloud Functions、Go |

## ブログデータの生成

Cloudflare Workersの実行環境ではリポジトリ内のMarkdownを直接読み込まないため、
開発・ビルド前に記事をJSONへ変換してアプリケーションへ含めます。

```text
src/content/blog/*.md
        │
        ▼
scripts/generate-blog-data.ts
        │
        ▼
src/generated/blogs.json
        │
        ▼
Next.js（記事一覧・記事詳細の静的生成）
        │
        ▼
OpenNext → Cloudflare Workers
```

`predev`、`prebuild`、`precheck`で`bun run generate:blog-data`が自動実行されるため、
通常は手動生成不要です。

## ディレクトリ構成

```text
.
├── .agents/                       # AIエージェント向け規則とタスク仕様
├── .github/                       # Issue・Pull Request・CIの設定
├── src/
│   ├── app/
│   │   ├── page.tsx              # プロフィールと記事一覧
│   │   ├── [slug]/page.tsx       # 記事詳細ページ
│   │   ├── scraps/                # スクラップ一覧・詳細
│   │   ├── admin/scraps/          # Accessで保護する管理画面
│   │   ├── api/admin/             # スクラップ書き込み・プレビューAPI
│   │   ├── layout.tsx             # 共通レイアウトとメタデータ
│   │   └── globals.css            # Tailwindテーマと共通スタイル
│   ├── components/
│   │   ├── Blog.tsx               # 変換済み記事本文の表示
│   │   └── ListItem.tsx           # 記事一覧カード
│   ├── consts/                    # サイト共通定数
│   ├── content/blog/              # ブログ記事のMarkdown
│   ├── generated/blogs.json       # ビルド前に生成される記事データ
│   └── lib/
│       ├── blog.ts                # 記事データ取得処理
│       └── scraps/                # D1・Markdown・Accessの処理
├── migrations/                    # D1マイグレーション
├── scripts/
│   ├── generate-blog-data.ts      # MarkdownからJSONを生成
│   └── verify-d1-migrations.sh    # 空のD1へマイグレーションを検証
├── public/                        # プロフィール画像、OGP画像など
├── cloudflare/workers/
│   └── ogp-generate/              # OGP画像生成Worker
├── gcp/functions/                 # アナリティクス通知用Cloud Functions
├── mise.toml                      # 開発ツールとタスクの定義
├── open-next.config.ts            # OpenNext設定
├── wrangler.jsonc                 # Worker・D1・Access変数の設定
└── package.json
```

`src/generated/`、`.next/`、`.open-next/`、`.wrangler/`、`next-env.d.ts`は生成物です。
直接編集せず、元になるMarkdown、生成スクリプト、Next.jsまたはWranglerの設定を変更してください。

## ローカル開発

### 必要なもの

* [mise](https://mise.jdx.dev/)

Bun、Node.js、Go、`note-cli`はmiseで管理するため、個別にインストールする必要はありません。

| ツール | バージョン | 導入方法 |
| --- | --- | --- |
| Bun | 1.1.2 | miseのBunバックエンド |
| Node.js | 24.14.0 | miseのNode.jsバックエンド |
| Go | 1.26.1 | miseのGoバックエンド |
| note-cli | v0.7.1 | GitHub ReleasesのOS・CPU別バイナリ |

バージョンとタスクは`mise.toml`で定義しています。`note-cli`の導入にGoやHomebrewは使用しません。

### セットアップ

```bash
mise trust
mise run setup
bun run dev
```

`mise run setup`は次をまとめて実行します。

1. miseで固定されたツールを準備する
2. ルートのBun依存関係を固定lockfileから導入する
3. OGP Workerのnpm依存関係を固定lockfileから導入する
4. GCP FunctionsのGoモジュールを取得する
5. ローカルD1へ未適用のマイグレーションを適用する

シェルでmiseを有効化している場合、以降は通常どおり`bun run dev`を実行できます。

開発サーバーは通常、<http://localhost:3000/>で起動します。

## miseタスク

開発時によく使う操作はmiseタスクとして実行できます。利用可能なタスクは`mise tasks`で確認できます。

| コマンド | 説明 |
| --- | --- |
| `mise run setup` | ツールと依存関係を導入し、ローカルD1を準備 |
| `mise run verify` | 全プロジェクトの完了条件をまとめて検証 |
| `mise run format` | ソースコードをフォーマット |
| `mise run lint` | ソースコードとMarkdownをLint |
| `mise run check` | フォーマット、Lint、型、Markdownを検査 |
| `mise run new:article` | `note-cli`で記事ファイルを作成 |

初回は`mise run setup`、タスク完了前は`mise run verify`を実行します。
GitHub Actionsも同じ2コマンドを使用します。

### 完了時の検証

`mise run verify`は次の検証を順番に実行する、このリポジトリ共通の完了条件です。

| 対象 | 検証 |
| --- | --- |
| メインアプリ | format、lint、型検査、Markdown lint、Vitest |
| D1 | 空の一時DBに全マイグレーションを適用 |
| OGP Worker | TypeScript型検査、Vitest |
| GCP Functions | 各Goモジュールの`go test ./...` |
| デプロイ成果物 | OpenNextによるCloudflare Workers向けビルド |

開発中の短いフィードバックには`mise run check`、`bun run test`、
`bun run lint:md -- path/to/changed.md`を利用できます。これらの部分コマンドは、最終的な
`mise run verify`の代わりにはなりません。

## Bunスクリプト

| コマンド | 説明 |
| --- | --- |
| `bun run dev` | 記事データを生成して開発サーバーを起動 |
| `bun run generate:blog-data` | Markdownから`blogs.json`を生成 |
| `bun run build` | 記事データを生成してNext.jsをビルド |
| `bun run start` | Next.jsの本番サーバーを起動 |
| `bun run build:cloudflare` | Cloudflare Workers向けの成果物を生成 |
| `bun run preview` | Workersランタイムでローカルプレビュー |
| `bun run deploy` | Cloudflare Workersへビルド・デプロイ |
| `bun run db:migrate:local` | ローカルD1へマイグレーションを適用 |
| `bun run db:migrate:remote` | 本番D1へマイグレーションを適用 |
| `bun run types:cloudflare` | Cloudflare bindingの型定義を生成 |
| `bun run test` | Vitestでテストを実行 |
| `bun run format` | ソースコードをフォーマット |
| `bun run lint` | ソースコードとMarkdownをLint |
| `bun run check` | フォーマット、Lint、型、Markdownを検査 |
| `bun run lint:md` | Markdownのみを検査 |

## ブログ記事の追加

`src/content/blog/`へMarkdownファイルを追加します。ファイル名がURLのslugになります。

```markdown
---
title: "記事タイトル"
tags: ["TypeScript", "Tech"]
date: "2026-07-19"
---

ここに本文を書きます。
```

Frontmatterの`title`、`tags`、`date`は必須です。記事は`date`の降順で表示されます。
`title`は1〜100文字、`tags`は1〜5個、`date`は`YYYY-MM-DD`形式にします。
本文には[ZennのMarkdown記法](https://zenn.dev/zenn/articles/markdown-guide)を利用できます。

ブログ本文はZenn記法を保持するため、通常のMarkdown lint対象外です。記事データ生成と
本番ビルドで検証します。それ以外のMarkdownを編集した場合は、開発中に
`bun run lint:md -- path/to/changed.md`を実行してください。

## スクラップ

公開画面は`/scraps`、所有者向けの管理画面は`/admin/scraps`です。
ひとつのテーマへMarkdownの投稿を時系列で追加でき、URLだけの行や
`@[card](URL)`はZenn Markdownのリンクカードとして表示されます。

ローカル開発ではCloudflare Accessの認証を省略します。最初にD1の
マイグレーションを適用してから開発サーバーを起動してください。

```bash
bun run db:migrate:local
bun run dev
```

本番では`/admin/scraps/*`と`/api/admin/*`をCloudflare Accessで保護します。
管理API側でも`Cf-Access-Jwt-Assertion`の署名、issuer、audienceを検証します。

スキーマを変更するときは`migrations/`へ連番のSQLファイルを追加します。既存のローカルDBを
更新する場合だけ`bun run db:migrate:local`を実行してください。`mise run verify`では既存DBを
使わず、空の一時DBにすべてのマイグレーションを適用して履歴を検証します。本番への適用は
自動化せず、明示的な依頼とレビューを経て実行します。

## Cloudflareへのデプロイ

メインアプリは`@opennextjs/cloudflare`でCloudflare Workers向けに変換します。

```bash
bun run preview  # ローカル確認
bun run deploy   # 手動デプロイ
```

Cloudflare Workers BuildsでGit連携する場合の設定例です。

```text
Production branch: main
Build command:     npx @opennextjs/cloudflare build
Deploy command:    npx @opennextjs/cloudflare deploy
Root directory:    /
```

Worker名、D1 binding、静的アセット、Accessの検証値は`wrangler.jsonc`で管理します。

### D1のセットアップ

Cloudflareへログインして本番データベースを作成します。

```bash
bunx wrangler login
bunx wrangler d1 create my-blog-scraps
```

作成結果の`database_id`を`wrangler.jsonc`の`SCRAPS_DB`へ追加し、
マイグレーションを適用します。

```bash
bun run db:migrate:remote
```

### Cloudflare Accessのセットアップ

Cloudflare Zero TrustでSelf-hosted applicationを作成し、次のパスを保護します。

```text
/admin/scraps*
/api/admin/*
```

One-time PINを有効にし、自分のメールアドレスだけを許可するAllow policyを設定します。
毎回の認証を避ける場合はGlobal、Application、Policyのセッション期間を
それぞれ1か月に設定します。

Access applicationのApplication Audience（AUD）とteam domainを、
`wrangler.jsonc`の`ACCESS_AUD`、`ACCESS_TEAM_DOMAIN`へ設定してください。

## 関連サービス

### OGP画像生成

`cloudflare/workers/ogp-generate/`に、記事タイトルからOGP画像を動的生成するWorkerがあります。
独立したnpmプロジェクトのため、依存関係を変更した場合は同ディレクトリの
`package-lock.json`も更新してください。デプロイはメインアプリと独立しています。
詳細は[OGP WorkerのREADME](cloudflare/workers/ogp-generate/README.md)を参照してください。

### アナリティクス通知

`gcp/functions/`に、Google AnalyticsやZennの集計結果を通知するCloud Functionsがあります。
複数の独立したGoモジュールがあり、`mise run verify`では両方のテストを実行します。
デプロイは各Makefileから行いますが、通常の実装タスクでは実行しません。
詳細は[GCPのREADME](gcp/README.md)を参照してください。

## コントリビューション

GitHubのタスクには[Issue template](.github/ISSUE_TEMPLATE/task.yml)、ローカルの作業計画には
[タスク仕様テンプレート](.agents/task-template.md)を利用できます。目的と背景、対象範囲と対象外、
観測可能な受け入れ条件、制約、許可する外部操作、参考情報、`mise run verify`以外に必要な
手動検証を明記してください。

変更時は関連するコード、テスト、設定を確認し、既存の設計に沿って必要最小限の範囲を編集します。
開発中は変更箇所に近いテストを実行し、利用方法やコマンドを変えた場合はREADMEも更新します。
受け入れ条件が不足している場合でも、安全で可逆な範囲は既存設計から判断できますが、外部公開、
データ破壊、権限変更など結果が大きく変わる操作は事前に合意してください。

Pull Requestでは[Pull Request template](.github/pull_request_template.md)を使い、受け入れ条件との
対応、検証結果、影響範囲、残課題を記録します。
