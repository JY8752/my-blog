<!-- Codex / OpenAI Agents向けプロジェクト指示 -->

[必須プロジェクトルール](.agents/docs.md)を参照すること。

## Cloud CodexによるPR作成

- Cloud CodexがPRを作成または更新する場合は、その操作の直前に
  [$prepare-pull-request](.agents/skills/prepare-pull-request/SKILL.md)を使用する。
- 実装と必須検証を先に完了し、PRのbase branchとの差分を最終確認してからMarkdown本文を
  生成する。
- 生成したMarkdownを実際のPR本文として使用する。1〜2文の全体説明と、すべての変更ファイルに
  対する1行説明が本文へ含まれるまで、PRを作成または更新しない。
- UIの見た目が変わる場合だけ、変更結果を表す代表スクリーンショットを最大1枚追加する。
