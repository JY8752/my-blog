#!/usr/bin/env python3
"""Validate an AI implementation-plan GitHub Issue body."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


VERSION_MARKER = "<!-- ai-implementation-plan:v1 -->"
REQUEST_ID_PATTERN = re.compile(
    r"<!-- ai-plan-request-id:"
    r"[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12} -->",
    re.IGNORECASE,
)
REQUIRED_SECTIONS = (
    "purpose",
    "current-state",
    "implementation-baseline",
    "scope",
    "out-of-scope",
    "implementation-approach",
    "change-candidates",
    "decisions",
    "acceptance-criteria",
    "deliverables",
    "constraints",
)
OPTIONAL_SECTION = "additional-verification"
SECTION_PATTERN = re.compile(r"<!-- ai-section:([a-z-]+) -->")
REPOSITORY_PATTERN = re.compile(
    r"(?m)^-\s*Repository:\s*`[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+`\s*$"
)
BASE_BRANCH_PATTERN = re.compile(r"(?m)^-\s*Base branch:\s*`[^`\r\n]+`\s*$")
ABSOLUTE_PATH_PATTERNS = (
    re.compile(r"/Users/[^\s`]+"),
    re.compile(r"/home/[^\s`]+"),
    re.compile(r"[A-Za-z]:\\Users\\[^\s`]+"),
)
SECRET_PATTERNS = (
    re.compile(r"-----BEGIN [^-]*PRIVATE KEY-----"),
    re.compile(r"(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})"),
    re.compile(r"(?:xox[baprs]-[A-Za-z0-9-]{10,}|sk_live_[A-Za-z0-9]{16,})"),
)


class ValidationError(ValueError):
    """Raised when the issue contract is invalid."""


def section_contents(body: str) -> dict[str, str]:
    matches = list(SECTION_PATTERN.finditer(body))
    names = [match.group(1) for match in matches]
    expected = list(REQUIRED_SECTIONS)
    if OPTIONAL_SECTION in names:
        expected.append(OPTIONAL_SECTION)
    if names != expected:
        raise ValidationError(
            "section markers must appear once in the required order; "
            f"expected {expected}, got {names}"
        )

    contents: dict[str, str] = {}
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        value = body[match.end() : end].strip()
        lines = value.splitlines()
        if not lines or not lines[0].startswith("## "):
            raise ValidationError(f"{match.group(1)} must start with an H2 heading")
        content = "\n".join(lines[1:]).strip()
        if not content:
            raise ValidationError(f"{match.group(1)} must not be empty")
        contents[match.group(1)] = content
    return contents


def validate(title: str, body: str) -> None:
    if not title.strip() or "\n" in title or "\r" in title:
        raise ValidationError("title must be a non-empty single line")
    if len(title) > 256:
        raise ValidationError("title must be 256 characters or fewer")
    if title.lstrip().lower().startswith("[ai]"):
        raise ValidationError("title must not use an [AI] prefix")
    if len(body) > 60_000:
        raise ValidationError("body must be 60000 characters or fewer")
    if body.count(VERSION_MARKER) != 1:
        raise ValidationError("body must contain exactly one v1 marker")
    request_ids = REQUEST_ID_PATTERN.findall(body)
    if len(request_ids) != 1:
        raise ValidationError("body must contain exactly one valid request ID marker")

    contents = section_contents(body)
    baseline = contents["implementation-baseline"]
    if REPOSITORY_PATTERN.search(baseline) is None:
        raise ValidationError("implementation baseline must contain Repository")
    if BASE_BRANCH_PATTERN.search(baseline) is None:
        raise ValidationError("implementation baseline must contain Base branch")
    if re.search(r"(?m)^\s*-\s*\[ \]\s+\S", contents["acceptance-criteria"]) is None:
        raise ValidationError("acceptance criteria must contain an unchecked checkbox")

    for pattern in ABSOLUTE_PATH_PATTERNS:
        if pattern.search(body):
            raise ValidationError("body must not contain local absolute paths")
    for pattern in SECRET_PATTERNS:
        if pattern.search(body):
            raise ValidationError("body appears to contain a secret")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("body", type=Path, help="Path to the issue body Markdown")
    parser.add_argument("--title", required=True, help="Issue title")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        body = args.body.read_text(encoding="utf-8")
        validate(args.title, body)
    except (OSError, UnicodeError, ValidationError) as error:
        print(f"invalid issue plan: {error}", file=sys.stderr)
        return 1
    print("valid issue plan")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
