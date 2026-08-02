# コーディングルール

人またはAIエージェントの判断が必要で、機械的に保証できないルールだけを記載します。
format、lint、型検査、テスト、ビルドなど`mise run verify`で保証される事項は記載しません。

## サーバー境界

- Cloudflare binding、Access認証、D1、サーバー側Markdown変換を扱うモジュールは
  `import "server-only"`で明示し、Client Componentから参照しない

## UI

- UIを実装またはレビューするときは、`.stitch/DESIGN.md`をデザインシステムの
  source of truthとして参照する
- 色、タイポグラフィ、余白、角丸、影、モーションは、`src/app/globals.css`の`@theme`へ
  定義されたsemantic tokenをTailwind CSSのutility class経由で使用する
- デザインシステムに対応するtokenがある場合、コンポーネントへ色コード、CSS変数、
  Tailwind CSSのarbitrary valueを直接記述しない
- 再利用するデザイン値が不足している場合は、コンポーネントへ任意値を追加せず、
  `.stitch/DESIGN.md`と`src/app/globals.css`のtokenを同期してからutility classとして使用する
- `src/app/globals.css`には、デザイントークン、全体へ適用する基礎スタイル、
  共通アニメーション、Zennコンテンツのスタイルだけを置く

## ブログ

- `src/app/[slug]/page.tsx`の記事詳細は`generateStaticParams()`による静的生成を維持する

## Scrap管理API

- `/api/admin/*`では、入力の処理や永続化より前に`requireAdmin()`と`assertSameOrigin()`を実行する
- リクエストボディは`readJsonBody()`で読み取り、`src/lib/scraps/validation.ts`の
  用途別parserで検証してからrepositoryまたはMarkdown変換へ渡す
- APIで捕捉したエラーは`apiErrorResponse()`でJSONレスポンスへ変換する
