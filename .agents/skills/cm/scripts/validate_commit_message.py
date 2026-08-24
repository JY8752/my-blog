#!/usr/bin/env python3
"""Validate the one-line commit message contract used by the cm skills."""

from __future__ import annotations

import re
import sys


TYPE_TO_EMOJI = {
    "feat": "✨",
    "fix": "🐛",
    "refactor": "♻️",
    "perf": "⚡",
    "docs": "📝",
    "test": "✅",
    "style": "🎨",
    "build": "📦",
    "ci": "👷",
    "chore": "🔧",
}

MESSAGE_PATTERN = re.compile(
    r"^(?P<type>feat|fix|refactor|perf|docs|test|style|build|ci|chore)"
    r"(?:\((?P<scope>[a-z0-9._/-]+)\))?(?P<breaking>!)?: "
    r"(?P<emoji>✨|🐛|♻️|⚡|📝|✅|🎨|📦|👷|🔧) "
    r"(?P<summary>[^\r\n]+)$"
)


def fail(message: str) -> int:
    print(f"invalid commit message: {message}", file=sys.stderr)
    return 1


def main() -> int:
    raw = sys.stdin.read()
    if raw.endswith("\n"):
        raw = raw[:-1]
    if "\n" in raw or "\r" in raw:
        return fail("must be exactly one line")
    if not raw or raw != raw.strip():
        return fail("must not be empty or have surrounding whitespace")
    if len(raw) > 72:
        return fail("must be 72 characters or fewer")
    if any(token in raw for token in ("```", "\"", "'", "「", "」", "『", "』")):
        return fail("must not contain code fences or quotes")

    match = MESSAGE_PATTERN.fullmatch(raw)
    if match is None:
        return fail("must use Conventional Commits with the mapped emoji")
    if TYPE_TO_EMOJI[match["type"]] != match["emoji"]:
        return fail("emoji does not match the commit type")
    if not re.search(r"[^\W\d_]", match["summary"], re.UNICODE):
        return fail("summary must contain descriptive text")
    if match["summary"].endswith(("。", ".", "．")):
        return fail("summary must not end with a period")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
