#!/usr/bin/env python3
"""Tests for the implementation-plan Issue contract validator."""

from __future__ import annotations

import unittest

from validate_issue_body import ValidationError, validate


REQUEST_ID = "00000000-0000-4000-8000-000000000000"


def valid_body(*, additional_verification: bool = False) -> str:
    sections = [
        ("purpose", "目的・背景", "検索結果を絞り込めるようにする。"),
        ("current-state", "現状", "現在は全件だけを表示する。"),
        (
            "implementation-baseline",
            "実装基準",
            "- Repository: `owner/repository`\n- Base branch: `main`",
        ),
        ("scope", "対象範囲", "- 記事一覧の検索。"),
        ("out-of-scope", "対象外", "- 管理画面の検索。"),
        ("implementation-approach", "実装方針", "1. 検索条件を追加する。"),
        ("change-candidates", "変更候補", "- `src/app/page.tsx`"),
        ("decisions", "設計上の決定", "- URLへ検索条件を保持する。"),
        ("acceptance-criteria", "受け入れ条件", "- [ ] キーワードで絞り込める。"),
        (
            "deliverables",
            "成果物",
            "- 完了時はOpen Pull Request。\n- 未完了時はDraft Pull Request。",
        ),
        ("constraints", "制約・注意事項", "- 既存URLとの互換性を維持する。"),
    ]
    if additional_verification:
        sections.append(
            ("additional-verification", "追加の検証要件", "- 日本語検索を確認する。")
        )
    rendered = [
        "<!-- ai-implementation-plan:v1 -->",
        f"<!-- ai-plan-request-id:{REQUEST_ID} -->",
    ]
    for marker, heading, content in sections:
        rendered.extend((f"<!-- ai-section:{marker} -->", f"## {heading}", content))
    return "\n\n".join(rendered) + "\n"


class ValidateIssueBodyTests(unittest.TestCase):
    def test_accepts_required_contract(self) -> None:
        validate("記事一覧へ検索を追加", valid_body())

    def test_accepts_optional_additional_verification(self) -> None:
        validate("記事一覧へ検索を追加", valid_body(additional_verification=True))

    def test_rejects_missing_section(self) -> None:
        body = valid_body().replace(
            "<!-- ai-section:out-of-scope -->", "<!-- removed-section -->"
        )
        with self.assertRaisesRegex(ValidationError, "required order"):
            validate("記事一覧へ検索を追加", body)

    def test_rejects_acceptance_criteria_without_checkbox(self) -> None:
        body = valid_body().replace("- [ ] キーワードで", "- キーワードで")
        with self.assertRaisesRegex(ValidationError, "unchecked checkbox"):
            validate("記事一覧へ検索を追加", body)

    def test_rejects_local_absolute_path(self) -> None:
        body = valid_body().replace(
            "`src/app/page.tsx`", "`/Users/example/project/src/app/page.tsx`"
        )
        with self.assertRaisesRegex(ValidationError, "absolute paths"):
            validate("記事一覧へ検索を追加", body)

    def test_rejects_ai_title_prefix(self) -> None:
        with self.assertRaisesRegex(ValidationError, r"\[AI\] prefix"):
            validate("[AI] 記事一覧へ検索を追加", valid_body())


if __name__ == "__main__":
    unittest.main()
