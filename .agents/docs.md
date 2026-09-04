# AIエージェント向け必須ルール

- コードを実装またはレビューするときは、[コーディングルール](coding-rules.md)を参照する。
- UIの見た目、レイアウト、デザインシステムを変更した場合は、作業完了前に[$stitch-sync](skills/stitch-sync/SKILL.md)を使ってStitchへ同期する。利用できない場合や同期先が不明な場合は、理由と未同期範囲を報告する。
- 明示的な依頼なしにデプロイや本番D1の変更を行わない。
- `.env`、`.dev.vars`、認証情報、APIキーをコミットまたはログ出力しない。
- `src/generated/`、`.next/`、`.open-next/`、`.wrangler/`、`next-env.d.ts`を直接編集しない。
- 既存のD1マイグレーションを変更しない。スキーマ変更は新しいマイグレーションとして追加する。
- 認証・認可を本番だけ無効化する変更や、検証を通すための例外追加を行わない。
- 依存関係を更新するときは対象プロジェクトのlockfileも更新し、検証を実行する。
- ReactまたはNext.jsのコードを実装・レビューするときは、`$vercel-react-best-practices`を使用する。

## 初回セットアップ

前提として[mise](https://mise.jdx.dev/)をインストールする。以降のコマンドは、すべて
リポジトリルートで実行する。

```bash
mise trust
mise run setup
```

`mise run setup`は、`mise.toml`で固定したBun、Node.js、Go、`note-cli`の導入、ルートと
OGP Workerの依存関係のインストール、GCP FunctionsのGoモジュールの取得、ローカルD1への
マイグレーション適用をまとめて実行する。セットアップ後は次のコマンドで開発サーバーを起動し、
通常は<http://localhost:3000/>で確認できる。

```bash
bun run dev
```

## 検証

変更内容にかかわらず、作業完了前にリポジトリルートで次の必須検証を実行する。

```bash
mise run verify
```

このコマンドは、メインアプリのformat・lint・型検査・Markdown lint・Vitest、空の一時D1への
全マイグレーション適用、OGP Workerの型検査とテスト、各GCP FunctionのGoテスト、
Cloudflare Workers向けビルドを順番に実行する。

開発中に素早く確認したい場合は、変更範囲に応じて次の部分検証を利用できる。

```bash
mise run check
bun run test
bun run lint:md -- path/to/changed.md
```

部分検証は、完了前の`mise run verify`の代わりにはならない。環境依存などで必須検証を
実行できない場合は、実行済みの検証、失敗理由、未検証範囲を完了報告に記載する。
検証を無効化または回避して完了扱いにしない。
