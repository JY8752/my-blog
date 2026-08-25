---
name: github-create-implementation-issue
description: 合意済みの実装計画をリポジトリと照合し、確認後にai-planラベル付きGitHub Issueとして登録する。ユーザーが$github-create-implementation-issueを呼び出したとき、または実装計画をGitHub Issueへ登録するよう依頼したときに使用する。ai-readyの付与、既存Issueの編集、Actions設定は行わない。
---

# GitHub実装計画Issue

会話や入力文書にある合意済みの実装計画を、実装AIが利用できるIssue契約へ変換する。Issue作成は外部状態の変更であるため、全文プレビュー後の明示承認を必須にする。

## 計画を確定する

1. 会話内の共有理解またはユーザーが渡した計画を優先する。計画がなければ、要望とリポジトリから組み立てる。
2. コード、設定、既存Issueから判明する事実は調査し、ユーザーへ聞かない。結果を変える判断だけを一問ずつ確認する。
3. 重要な未解決事項が残る間はIssue案を確定しない。ユーザーの意図を拡張したり、合意済みの方針を別案へ置き換えたりしない。
4. 会話ログは転載せず、実装に影響する決定と理由だけを要約する。却下案は再提案を防ぐ必要がある場合だけ対象外または制約として残す。

## 作成先と基準状態を確認する

Issue本文を作る前に、次の読み取り専用チェックを行う。

1. `git rev-parse --show-toplevel`と`gh auth status`が成功することを確認する。
2. カレントリポジトリで`gh repo view --json nameWithOwner,defaultBranchRef`を実行し、作成先とdefault branchを解決する。フォルダ名や会話から推測しない。ユーザーが`--repo`相当の作成先を明示した場合だけ、その値を使用する。
3. `git status --porcelain=v1 --untracked-files=all`が空であること、現在ブランチがdefault branchであることを確認する。
4. ローカルHEADとGitHub上のdefault branch最新SHAを比較する。一致しなければ停止する。switch、pull、fetch、stash、resetは自動実行しない。
5. `ai-plan`ラベルが存在することを確認する。なければIssueを作らず、セットアップが必要だと伝える。ラベルを自動作成しない。
6. `ai-ready`ラベルと、ラベル付与を起動条件にするActions workflowの有無を可能な範囲で確認する。見つからなくてもIssue作成は許可し、実装AIをまだ起動できない可能性を警告する。設定は変更しない。

作成先や基準状態を解決できない場合は推測で続行せず停止する。認証情報、remote URL、秘密情報候補の内容を出力しない。

## 重複を確認する

1. 作成先のopen Issueを`gh issue list`で検索し、タイトル、本文、ラベルから類似候補を調べる。
2. 類似候補があれば、番号、タイトル、URL、類似点を提示し、新規作成するか既存Issueを使うか一問だけ確認する。
3. 既存Issueを使う場合は、そのIssueを編集せずURLを提示して終了する。新規作成が明示された場合だけ続行する。

## Issue案を作成する

1. [references/issue-contract.md](references/issue-contract.md)を読み、合意済み計画をIssue本文へ変換する。
2. タイトルと本文は計画の主言語を維持する。コード識別子、ファイルパス、コマンド、既存用語は無理に翻訳しない。
3. 変更候補はリポジトリ相対パスで記載する。ローカル絶対パス、秘密情報、認証情報を含めない。
4. default branchは必ず記載する。計画時点SHAは取得でき、判断に役立つ場合だけ任意で記載し、実装時のcheckout先として固定しない。
5. 一般的な検証コマンドは記載しない。Issue特有の検証がある場合だけ「追加の検証要件」を含める。
6. タイトルへ`[AI]`などの接頭辞を付けない。必須ラベルは`ai-plan`だけとし、追加ラベル、assignee、milestone、Projectはユーザーが明示した既存値だけを使う。`ai-ready`は付けない。
7. 一意なrequest IDを生成して本文の非表示マーカーへ入れる。作成用本文は一時領域に置き、リポジトリへ計画ファイルを残さない。
8. `python3 scripts/validate_issue_body.py --title <title> <body-file>`をskillディレクトリから実行する。検証に失敗した本文はプレビューまたは作成しない。

## 承認後に作成する

1. 作成先`owner/repository`、タイトル、全ラベル、指定されたmetadata、本文全文、事前警告を表示する。
2. 「この内容でGitHub Issueを作成しますか？ (y/N)」と尋ね、明示的な肯定を待つ。修正指示があればIssue案を更新し、全文を再表示して再承認を求める。
3. 承認後にだけ、`gh issue create --repo <owner/repository> --title <title> --body-file <body-file> --label ai-plan`を1回実行する。明示されたmetadataだけを追加する。
4. 成功後に作成済みIssueを読み取り、URL、タイトル、`ai-plan`ラベル、本文マーカーを確認して報告する。`ai-ready`は追加しない。
5. タイムアウトや通信エラーで作成結果が不明な場合は再試行しない。request IDを使って最近のIssueを検索し、見つかればそのURLを報告する。見つからなければ、再試行してよいかユーザーへ確認する。
6. 一時ファイルを片付ける。Issue本文をローカル成果物として保存しない。

## 実行しない操作

- 既存Issueの本文、タイトル、ラベルを変更しない。
- `ai-ready`ラベルを付けない。
- ラベル、Actions workflow、GitHub Projectなどのリポジトリ設定を作成・変更しない。
- default branchへcommitまたはpushしない。
- Issue作成の成否が不明な状態で自動再試行しない。
