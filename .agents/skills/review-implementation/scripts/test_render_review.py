#!/usr/bin/env python3
"""Regression tests for the implementation review renderer."""

from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from render_review import (
    default_output_path,
    ensure_review_output,
    redact,
    render_report,
    write_report,
)


class RedactionTests(unittest.TestCase):
    def test_redacts_common_credential_formats(self) -> None:
        samples = (
            '{"api_key": "json-secret"}',
            "Authorization: Bearer header-secret",
            "github_token=token-secret",
            'password = "correct horse battery staple"',
            "ghp_abcdefghijklmnopqrstuvwxyz1234567890",
            "eyJabcdefghijk.abcdefghijklmnop.abcdefghijklmnop",
        )

        for sample in samples:
            with self.subTest(sample=sample):
                redacted = redact(sample)
                self.assertIn("[REDACTED]", redacted)
                self.assertNotIn("secret", redacted)

    def test_redacts_unterminated_quoted_credentials(self) -> None:
        samples = (
            ('password="unterminated-value', 'password="[REDACTED]'),
            ("password='unterminated-value", "password='[REDACTED]"),
        )

        for sample, expected in samples:
            with self.subTest(sample=sample):
                self.assertEqual(redact(sample), expected)

    def test_rendered_content_is_html_escaped(self) -> None:
        report = {
            "title": "<script>alert(1)</script>",
            "verification": {},
            "files": [],
        }

        rendered = render_report(report)

        self.assertIn("&lt;script&gt;alert(1)&lt;/script&gt;", rendered)
        self.assertNotIn("<script>alert(1)</script>", rendered)


class OutputTests(unittest.TestCase):
    def test_default_output_path_uses_report_title(self) -> None:
        path = default_output_path("feat: レビューHTMLへPRタイトルを反映")

        self.assertTrue(
            path.name.endswith("-feat-レビューHTMLへPRタイトルを反映.html")
        )

    def test_existing_report_is_not_overwritten(self) -> None:
        original_directory = Path.cwd()
        with tempfile.TemporaryDirectory() as directory:
            try:
                os.chdir(directory)
                requested = ensure_review_output(Path(".agents/review/report.html"))
                first = write_report(requested, "first")
                second = write_report(requested, "second")
            finally:
                os.chdir(original_directory)

            self.assertEqual(first.name, "report.html")
            self.assertEqual(second.name, "report-2.html")
            self.assertEqual(first.read_text(encoding="utf-8"), "first")
            self.assertEqual(second.read_text(encoding="utf-8"), "second")


if __name__ == "__main__":
    unittest.main()
