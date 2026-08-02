# コーディングルール

人またはAIエージェントの判断が必要で、機械的に保証できないルールだけを記載します。
format、lint、型検査、テスト、ビルドなど`mise run verify`で保証される事項は記載しません。

## 配置とデータアクセス

- コンポーネントは実行環境やデータ取得の有無でディレクトリを分けず、利用する`page.tsx`または
  `layout.tsx`に最も近い`_components`へ置く
- 画面固有の参照処理は画面に最も近い`_queries`へ置き、汎用fetch wrapperではなく
  `listScraps()`や`getScrapBySlug()`のように目的を表す関数として定義する
- 画面固有の更新処理は操作元に最も近い`_actions`へ置き、複雑になった処理だけを
  `_commands`へ抽出する
- 参照処理を`_queries`、更新処理を`_actions`または`_commands`へ分けるが、読み書きで
  データストアを分離する厳密なCQRSは導入しない
- 機能固有のquery、action、command、validationは先回りして共通化せず、複数箇所から
  利用された時点で最も近い共通階層へ移す
- DB接続、認証、Cloudflare bindingなど、複数の画面や機能で実際に共有する基盤処理だけを
  共通のサーバーモジュールへ置く

## サーバー境界

- Cloudflare binding、Access認証、D1、サーバー側Markdown変換を扱うモジュールは
  `import "server-only"`で明示し、Client Componentから参照しない

## Route Handler

- `app/api`を汎用的なサーバー処理置き場にせず、外部連携、Webhook、ポーリング、
  ストリーミング、ファイル転送、リクエストキャンセルなどHTTPとして扱う理由がある処理に限る
- Route Handlerの内部はまずroute（controller）、domain、repositoryで構成し、処理や
  トランザクションが複雑になった場合だけuse caseまたはserviceを追加する
- Markdownプレビューはデバウンスとリクエストキャンセルを必要とするためAPIとして扱う

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
- リクエストボディは`readJsonBody()`で読み取り、`src/app/_lib/scraps/validation.ts`の
  用途別parserで検証してからrepositoryまたはMarkdown変換へ渡す
- APIで捕捉したエラーは`apiErrorResponse()`でJSONレスポンスへ変換する
