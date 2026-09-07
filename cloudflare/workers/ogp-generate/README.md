# OGP画像生成

Cloudflare Workersを使用してOGP画像を動的に生成する。

## セットアップ

```bash
mise run setup
```

依存関係はルートのBun workspaceと`bun.lockb`で管理する。

## ローカル開発

```bash
bun run dev:ogp
```

## 検証

```bash
bun run --cwd cloudflare/workers/ogp-generate typecheck
bun run --cwd cloudflare/workers/ogp-generate test
bun run deploy:ogp:dry-run
```

## デプロイ

```bash
bunx wrangler login
bun run deploy:ogp
```

デプロイ後はWranglerが表示する`workers.dev` URLで動作を確認する。
