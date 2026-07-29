# プロジェクトドキュメント

## 概要

個人プロフィール兼技術ブログ「ぱんだ.dev」です。Next.js App Routerで公開画面と
管理画面を実装し、OpenNextを介してCloudflare Workersへデプロイします。

ブログ記事はリポジトリ内のMarkdown、時系列形式のスクラップはCloudflare D1で管理します。
本番のスクラップ管理画面と管理APIはCloudflare Accessで保護します。

公開URL: <https://jy-panda.com/>

## 技術スタック

| レイヤー | 技術 |
| --- | --- |
| ツール管理 | mise |
| パッケージ管理 | Bun（メイン）、npm（OGP Worker） |
| Web | Next.js、React、TypeScript |
| UI | Tailwind CSS、PostCSS |
| Markdown | gray-matter、zenn-markdown-html、zenn-content-css |
| ホスティング | Cloudflare Workers、OpenNext |
| データ・認証 | Cloudflare D1、Cloudflare Access |
| OGP | 独立したCloudflare Worker |
| 分析通知 | Google Cloud Functions、Go |
| 品質管理 | Vite+、Vitest、markdownlint |

miseはBun、Node.js、Go、`note-cli`のバージョンを`mise.toml`で固定します。

## アーキテクチャ

```text
src/content/blog/*.md
        |
        v
scripts/generate-blog-data.ts
        |
        v
src/generated/blogs.json -----> Next.js App Router
                                      |
                     +----------------+----------------+
                     |                                 |
                     v                                 v
              公開ブログ・Scrap                 /admin・/api/admin
                     |                                 |
                     |                                 v
                     +------------ Cloudflare D1 < Cloudflare Access
                                      |
                                      v
                              OpenNext / Workers

cloudflare/workers/ogp-generate/       独立したOGP画像生成Worker
gcp/functions/                         独立した分析通知Functions
```

`src/generated/blogs.json`と`next-env.d.ts`は生成物です。直接編集せず、元になる
Markdown、生成スクリプト、Next.js設定を変更します。

## ディレクトリ構成

```text
.
├── .agents/
│   ├── docs.md                    # エージェントを含む開発者向けの規約
│   └── task-template.md           # ローカルで使うタスク仕様
├── .github/
│   ├── ISSUE_TEMPLATE/            # 標準化したタスク入力
│   ├── pull_request_template.md
│   └── workflows/ci.yml
├── src/
│   ├── app/
│   │   ├── page.tsx               # プロフィールと記事一覧
│   │   ├── [slug]/                # ブログ記事詳細
│   │   ├── scraps/                # Scrap一覧・詳細
│   │   ├── admin/scraps/          # 所有者向け管理画面
│   │   └── api/admin/             # 管理API
│   ├── components/                # Reactコンポーネント
│   ├── content/blog/              # ブログ記事のMarkdown
│   ├── generated/                 # ビルド前に作られる生成物
│   └── lib/
│       ├── blog.ts                # ブログデータの取得
│       └── scraps/                # D1、Access、Markdown、HTTP処理
├── migrations/                    # D1マイグレーション
├── scripts/                       # 生成・検証スクリプト
├── cloudflare/workers/
│   └── ogp-generate/              # 独立したnpmプロジェクト
├── gcp/functions/                 # 独立したGoモジュール
├── mise.toml                      # ツールバージョンと統一タスク
└── wrangler.jsonc                 # メインWorkerとD1 binding
```

## セットアップ

必要なグローバルツールはmiseだけです。リポジトリをcloneした後、次を実行します。

```bash
mise trust
mise run setup
```

`mise run setup`は次をまとめて実行します。

1. miseで固定されたツールを準備する
2. ルートのBun依存関係を固定lockfileから導入する
3. OGP Workerのnpm依存関係を固定lockfileから導入する
4. GCP FunctionsのGoモジュールを取得する
5. ローカルD1へ未適用のマイグレーションを適用する

セットアップ後は`mise run dev`または`bun run dev`で開発サーバーを起動します。

## 完了条件

すべての実装タスクは、作業完了前にリポジトリルートで次を実行します。

```bash
mise run verify
```

このコマンドが唯一の共通完了判定です。次の検証を順番に実行します。

| 対象 | 検証 |
| --- | --- |
| メインアプリ | format、lint、型検査、Markdown lint |
| メインアプリ | Vitest |
| D1 | 空の一時DBに全マイグレーションを適用 |
| OGP Worker | TypeScript型検査、Vitest |
| GCP Functions | 各Goモジュールの`go test ./...` |
| デプロイ成果物 | OpenNextによるCloudflare Workers向けビルド |

失敗した検証を無効化または回避して完了扱いにしません。環境依存で実行できない場合は、
実行した検証、失敗理由、未検証範囲を完了報告へ記載します。

開発中の短いフィードバックには次の部分コマンドを利用できます。

```bash
mise run check
bun run test
bun run lint:md -- path/to/changed.md
```

部分コマンドは最終的な`mise run verify`の代わりにはなりません。

## エージェントの作業手順

1. `AGENTS.md`とこのドキュメントを読む。
2. `.agents/task-template.md`の項目に沿って目的、対象範囲、対象外、受け入れ条件を確認する。
3. 関連コード、テスト、設定を調査し、既存の設計と変更範囲を把握する。
4. 既存の利用者変更を保持し、必要最小限のファイルを編集する。
5. 開発中は変更箇所に近いテストを実行する。
6. ドキュメントやコマンドが変わった場合はREADMEとこのドキュメントを同期する。
7. `mise run verify`を実行し、変更内容と結果を報告する。

受け入れ条件が不足していても、安全で可逆な範囲は既存設計から推定して進めます。
外部公開、データ破壊、権限変更など結果が大きく変わる判断はユーザーへ確認します。

## 安全上の境界

- 明示的な依頼なしに`bun run deploy`や`wrangler deploy`を実行しない。
- 明示的な依頼なしに`bun run db:migrate:remote`など本番D1を変更する操作を実行しない。
- `.env`、`.dev.vars`、認証情報、APIキーをコミットまたはログ出力しない。
- `src/generated/`、`.next/`、`.open-next/`、`.wrangler/`、`next-env.d.ts`を
  直接編集しない。
- 既存マイグレーションを変更せず、スキーマ変更は新しいマイグレーションとして追加する。
- 認証・認可を本番だけ無効化する変更や、検証を通すための例外追加を行わない。
- 依存関係の更新はlockfileを含め、対象プロジェクトの検証を実行する。

## 変更種別ごとの注意

### Markdown

Markdownファイルを作成または編集した場合は、開発中に次を実行します。

```bash
bun run lint:md -- path/to/changed.md
```

対象が多い場合や不明な場合は`bun run lint:md`を実行します。ブログ本文はZenn記法を
保持するため通常のMarkdown lint対象外ですが、記事データ生成と本番ビルドで検証します。

### ブログ記事

`src/content/blog/`へMarkdownファイルを追加します。ファイル名がURLのslugになります。

```markdown
---
title: "記事タイトル"
tags: ["TypeScript", "Tech"]
date: "2026-07-19"
---

記事本文
```

`title`、`tags`、`date`は必須です。titleは1〜100文字、tagsは1〜5個、
dateは`YYYY-MM-DD`形式にします。本文にはZenn Markdown記法を利用できます。

### D1

- スキーマ変更は`migrations/`へ連番のSQLファイルとして追加する。
- `mise run verify`は既存のローカルDBではなく空の一時DBに全履歴を適用する。
- ローカルの開発DBを更新する場合だけ`bun run db:migrate:local`を実行する。
- 本番適用は自動化せず、明示的な依頼とレビューを必要とする。

### Cloudflare Access

本番の`/admin/scraps/*`と`/api/admin/*`をCloudflare Accessで保護します。
管理API側でも`Cf-Access-Jwt-Assertion`の署名、issuer、audienceを検証します。
ローカル開発でのみ認証を省略します。

### OGP Worker

`cloudflare/workers/ogp-generate/`は独立したnpmプロジェクトです。依存関係を変更した場合は
同ディレクトリの`package-lock.json`も更新します。デプロイはメインアプリと独立しています。

### GCP Functions

`gcp/functions/`には複数の独立したGoモジュールがあります。変更したモジュールだけでなく、
`mise run verify`で両方のテストを実行します。デプロイは各Makefileから行いますが、
通常の実装タスクでは実行しません。

## CI

GitHub ActionsはPull Requestとmainへのpushで次を実行します。

```bash
mise run setup
mise run verify
```

ローカルとCIで同じコマンドを利用し、CI専用の完了条件を作りません。

## タスク仕様

GitHubでは`.github/ISSUE_TEMPLATE/task.yml`、ローカルの作業計画では
`.agents/task-template.md`を使います。最低限、次を明記します。

- 目的と背景
- 対象範囲と対象外
- 観測可能な受け入れ条件
- 制約と許可された外部操作
- 参考情報
- `mise run verify`以外に必要な手動検証

Pull Requestでは`.github/pull_request_template.md`を使い、受け入れ条件との対応、
検証結果、影響範囲、残課題を記録します。

## 主要な規約

- スタイリングはTailwind CSSのutility classを使う。
- サイト全体で使う定数は`src/consts/message.ts`に置く。
- 記事詳細は`generateStaticParams()`を使って静的ページを生成する。
- サーバー専用処理はクライアントコンポーネントから分離する。
- Scrapの入力値は`src/lib/scraps/validation.ts`で検証する。
- APIエラーは`src/lib/scraps/http.ts`を通して一貫したJSONへ変換する。
