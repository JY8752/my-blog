# 実装計画Issue契約

本文は人が読みやすい見出しと、Actionsや検証スクリプトが利用する非表示マーカーで構成する。見出しと本文は計画の主言語に合わせてよいが、`ai-section`マーカーは変更しない。

## テンプレート

```markdown
<!-- ai-implementation-plan:v1 -->
<!-- ai-plan-request-id:00000000-0000-4000-8000-000000000000 -->

<!-- ai-section:purpose -->
## 目的・背景

実現したい結果と、その変更が必要な理由。

<!-- ai-section:current-state -->
## 現状

現在の振る舞い、問題、調査で確認した事実。

<!-- ai-section:implementation-baseline -->
## 実装基準

- Repository: `owner/repository`
- Base branch: `main`
- Planning snapshot: `abc1234` <!-- 任意。不要なら行ごと省略 -->

<!-- ai-section:scope -->
## 対象範囲

- 今回変更する振る舞いと領域。

<!-- ai-section:out-of-scope -->
## 対象外

- 今回は変更しないこと。

<!-- ai-section:implementation-approach -->
## 実装方針

1. 依存関係が分かる粒度の実装順序。
2. 実装AIがコードを再調査して適応できる余地を残す。

<!-- ai-section:change-candidates -->
## 変更候補

- `path/from/repository/root`

<!-- ai-section:decisions -->
## 設計上の決定

- 決定事項
  - 理由: 実装結果へ影響する根拠。

<!-- ai-section:acceptance-criteria -->
## 受け入れ条件

- [ ] 外部から観測できる完了条件。

<!-- ai-section:deliverables -->
## 成果物

- 完了条件を満たしたOpen Pull Request。
- 変更内容と実行した検証の記録。
- 未完了、検証失敗、判断待ちの場合はDraft Pull Requestと阻害要因の記録。

<!-- ai-section:constraints -->
## 制約・注意事項

- 守るべき境界、互換性、禁止事項。

<!-- ai-section:additional-verification -->
## 追加の検証要件

- このIssueに固有の検証。該当しなければマーカーとセクションを省略する。
```

## 記述ルール

- 目的と受け入れ条件は、実装方法ではなく観測可能な結果を中心に書く。
- 実装方針には変更候補と依存順序を含めるが、行単位の編集指示や完成コードを固定しない。
- コードスニペットは、API契約など誤解を防ぐために必要な場合だけ含める。
- 変更候補は確定ファイル一覧ではなく、計画時点で関連性を確認できたリポジトリ相対パスとして扱う。
- 「適切に対応する」「必要に応じて確認する」など、完了判定できない受け入れ条件を避ける。
- 一般的なテストやリポジトリ共通の検証コマンドは書かない。追加の検証要件は、このIssueだけに必要な場合に限る。
- 会話の議事録を貼らず、実装に影響する決定、理由、対象外だけを残す。
- ローカル絶対パス、環境変数の値、token、鍵、認証情報を含めない。
