#!/usr/bin/env python3
"""Render a self-contained implementation review report from JSON."""

from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
import sys
import unicodedata
import webbrowser
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any


SCHEMA = {
    "title": "実装レビュー",
    "summary": "変更全体の目的と概要",
    "generatedAt": "2026-08-03 12:34 JST",
    "baseline": {
        "start": "abc1234",
        "current": "working tree",
        "range": "abc1234 → working tree",
    },
    "stats": {"filesChanged": 2, "additions": 42, "deletions": 7},
    "verification": {
        "status": "passed | failed | partial | not-run",
        "command": "mise run verify",
        "summary": "検証結果の要約",
        "details": ["必要な補足"],
    },
    "verdict": "approve | approve-with-suggestions | changes-requested",
    "files": [
        {
            "path": "src/example.ts",
            "status": "added | modified | deleted | renamed | generated | binary | sensitive",
            "summary": "このファイルの変更を1行で説明",
            "details": ["必要な場合だけ詳細を記載"],
            "snippets": [
                {
                    "label": "重要な変更",
                    "language": "typescript",
                    "startLine": 10,
                    "code": "const value = createValue();",
                    "focusLines": [10],
                    "omittedBefore": False,
                    "omittedAfter": True,
                }
            ],
            "comments": [
                {
                    "severity": "critical | warning | suggestion | optional",
                    "line": 10,
                    "title": "指摘の要約",
                    "body": "問題または観察内容",
                    "impact": "起こり得る影響",
                    "suggestion": "具体的な改善案",
                }
            ],
        }
    ],
}

SEVERITY_LABELS = {
    "critical": "Critical",
    "warning": "Warning",
    "suggestion": "Suggestion",
    "optional": "Optional",
}
VERDICT_LABELS = {
    "approve": "Approve",
    "approve-with-suggestions": "Approve with suggestions",
    "changes-requested": "Changes requested",
}
VERIFICATION_LABELS = {
    "passed": "Passed",
    "failed": "Failed",
    "partial": "Partial",
    "not-run": "Not run",
}
FILE_STATUS_LABELS = {
    "added": "Added",
    "modified": "Modified",
    "deleted": "Deleted",
    "renamed": "Renamed",
    "generated": "Generated",
    "binary": "Binary",
    "sensitive": "Sensitive",
}

SECRET_PATTERNS = (
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})"),
    re.compile(r"(?:xox[baprs]-[A-Za-z0-9-]{10,}|sk_live_[A-Za-z0-9]{16,})"),
    re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),
    re.compile(
        r"-----BEGIN [^-]*PRIVATE KEY-----.*?-----END [^-]*PRIVATE KEY-----",
        re.DOTALL,
    ),
)
AUTH_PATTERN = re.compile(
    r'''(?ix)
    (["']?authorization["']?\s*[:=]\s*["']?)
    (?:(bearer|basic|token)\s+)?
    ([^"'\s,;}]+)
    '''
)
SENSITIVE_KEY_PATTERN = r'''(?:
    api[_-]?key|access[_-]?token|refresh[_-]?token|id[_-]?token|
    github[_-]?token|token|password|passwd|secret|client[_-]?secret|
    private[_-]?key
)'''
KEY_DOUBLE_QUOTED_VALUE_PATTERN = re.compile(
    r'''(?ix)(["']?'''
    + SENSITIVE_KEY_PATTERN
    + r'''["']?\s*[:=]\s*)"(?:\\.|[^"\\\r\n])*"'''
)
KEY_SINGLE_QUOTED_VALUE_PATTERN = re.compile(
    r'''(?ix)(["']?'''
    + SENSITIVE_KEY_PATTERN
    + r'''["']?\s*[:=]\s*)'(?:\\.|[^'\\\r\n])*' '''
)
KEY_UNTERMINATED_DOUBLE_QUOTED_VALUE_PATTERN = re.compile(
    r'''(?imx)(["']?'''
    + SENSITIVE_KEY_PATTERN
    + r'''["']?\s*[:=]\s*)"(?:\\.|[^"\\\r\n])*$'''
)
KEY_UNTERMINATED_SINGLE_QUOTED_VALUE_PATTERN = re.compile(
    r'''(?imx)(["']?'''
    + SENSITIVE_KEY_PATTERN
    + r'''["']?\s*[:=]\s*)'(?:\\.|[^'\\\r\n])*$'''
)
KEY_VALUE_PATTERN = re.compile(
    r'''(?ix)(["']?'''
    + SENSITIVE_KEY_PATTERN
    + r'''["']?\s*[:=]\s*)([^"'\s,;}]+)'''
)


def redact(value: Any) -> str:
    text = "" if value is None else str(value)
    text = AUTH_PATTERN.sub(
        lambda match: (
            f'{match.group(1)}{f"{match.group(2)} " if match.group(2) else ""}'
            "[REDACTED]"
        ),
        text,
    )
    text = KEY_DOUBLE_QUOTED_VALUE_PATTERN.sub(r'\1"[REDACTED]"', text)
    text = KEY_SINGLE_QUOTED_VALUE_PATTERN.sub(r"\1'[REDACTED]'", text)
    text = KEY_UNTERMINATED_DOUBLE_QUOTED_VALUE_PATTERN.sub(
        r'\1"[REDACTED]', text
    )
    text = KEY_UNTERMINATED_SINGLE_QUOTED_VALUE_PATTERN.sub(
        r"\1'[REDACTED]", text
    )
    text = KEY_VALUE_PATTERN.sub(r"\1[REDACTED]", text)
    for pattern in SECRET_PATTERNS:
        text = pattern.sub("[REDACTED]", text)
    return text


def escaped(value: Any) -> str:
    return html.escape(redact(value), quote=True)


def slug(value: Any) -> str:
    normalized = unicodedata.normalize("NFKC", str(value)).strip()
    safe = "".join(
        character if character.isalnum() or character in "_-" else "-"
        for character in normalized
    )
    collapsed = re.sub(r"-{2,}", "-", safe).strip("-_")
    return collapsed[:80] or "review"


def as_dict(value: Any, field: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError(f"{field} must be an object")
    return value


def as_list(value: Any, field: str) -> list[Any]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise ValueError(f"{field} must be an array")
    return value


def current_branch() -> str:
    result = subprocess.run(
        ["git", "branch", "--show-current"],
        check=False,
        capture_output=True,
        text=True,
    )
    return slug(result.stdout.strip() or "detached-head")


def default_output_path(title: Any = None) -> Path:
    timestamp = datetime.now().astimezone().strftime("%Y%m%d-%H%M%S-%f")
    if title is not None and str(title).strip():
        title_slug = slug(title)
    else:
        title_slug = current_branch()
    return Path(".agents/review") / f"{timestamp}-{title_slug}.html"


def ensure_review_output(path: Path) -> Path:
    root = (Path.cwd() / ".agents" / "review").resolve()
    resolved = path.resolve()
    if not resolved.is_relative_to(root):
        raise ValueError("output must be inside .agents/review")
    resolved.parent.mkdir(parents=True, exist_ok=True)
    return resolved


def write_report(path: Path, content: str) -> Path:
    """Write without replacing an existing report, adding a numeric suffix on collision."""
    for attempt in range(1000):
        candidate = (
            path
            if attempt == 0
            else path.with_name(f"{path.stem}-{attempt + 1}{path.suffix}")
        )
        try:
            with candidate.open("x", encoding="utf-8") as file:
                file.write(content)
            return candidate
        except FileExistsError:
            continue
    raise OSError("could not find an unused report filename")


def load_report(input_path: str) -> dict[str, Any]:
    if input_path == "-":
        value = json.load(sys.stdin)
    else:
        with Path(input_path).open(encoding="utf-8") as file:
            value = json.load(file)
    report = as_dict(value, "report")
    as_list(report.get("files"), "files")
    return report


def render_code(snippet: dict[str, Any]) -> str:
    code = redact(snippet.get("code", ""))
    start_line = int(snippet.get("startLine", 1))
    focus_lines = {int(line) for line in as_list(snippet.get("focusLines"), "focusLines")}
    rows: list[str] = []
    for offset, line in enumerate(code.splitlines() or [""]):
        line_number = start_line + offset
        focus_class = " code-line--focus" if line_number in focus_lines else ""
        rows.append(
            f'<span class="code-line{focus_class}">'
            f'<span class="line-number">{line_number}</span>'
            f'<span class="line-source">{html.escape(line)}</span></span>'
        )
    omitted_before = (
        '<div class="omission">⋯ 前の変更を省略</div>'
        if snippet.get("omittedBefore")
        else ""
    )
    omitted_after = (
        '<div class="omission">⋯ 後の変更を省略</div>'
        if snippet.get("omittedAfter")
        else ""
    )
    return (
        '<figure class="snippet">'
        f'<figcaption><span>{escaped(snippet.get("label", "コード抜粋"))}</span>'
        f'<span>{escaped(snippet.get("language", "text"))}</span></figcaption>'
        f'{omitted_before}<pre><code>{"".join(rows)}</code></pre>{omitted_after}'
        "</figure>"
    )


def render_comment(comment: dict[str, Any]) -> str:
    severity = str(comment.get("severity", "optional")).lower()
    if severity not in SEVERITY_LABELS:
        severity = "optional"
    line = comment.get("line")
    location = f"Line {escaped(line)}" if line is not None else "File level"
    fields = []
    for label, key in (("影響", "impact"), ("改善案", "suggestion")):
        if comment.get(key):
            fields.append(
                f'<div class="comment-detail"><dt>{label}</dt>'
                f'<dd>{escaped(comment[key])}</dd></div>'
            )
    return (
        f'<article class="review-comment severity-{severity}">'
        '<div class="comment-heading">'
        f'<span class="severity-badge">{SEVERITY_LABELS[severity]}</span>'
        f'<span class="comment-location">{location}</span></div>'
        f'<h4>{escaped(comment.get("title", "レビューコメント"))}</h4>'
        f'<p>{escaped(comment.get("body", ""))}</p>'
        f'<dl>{"".join(fields)}</dl></article>'
    )


def render_file(file_data: dict[str, Any], index: int) -> str:
    path = file_data.get("path", f"file-{index}")
    status = str(file_data.get("status", "modified")).lower()
    status_label = FILE_STATUS_LABELS.get(status, status.title())
    details = "".join(
        f"<p>{escaped(paragraph)}</p>"
        for paragraph in as_list(file_data.get("details"), "details")
    )
    snippets = "".join(
        render_code(as_dict(item, "snippet"))
        for item in as_list(file_data.get("snippets"), "snippets")
    )
    comments_data = [
        as_dict(item, "comment")
        for item in as_list(file_data.get("comments"), "comments")
    ]
    comments = (
        "".join(render_comment(item) for item in comments_data)
        if comments_data
        else '<p class="no-findings">✓ レビュー指摘なし</p>'
    )
    return (
        f'<section class="file-card" id="file-{index}">'
        '<div class="file-heading">'
        f'<div><span class="file-index">{index:02d}</span>'
        f'<h2>{escaped(path)}</h2></div>'
        f'<span class="file-status">{escaped(status_label)}</span></div>'
        f'<p class="file-summary">{escaped(file_data.get("summary", ""))}</p>'
        f'<div class="file-details">{details}</div>{snippets}'
        f'<div class="comments"><h3>Review comments</h3>{comments}</div>'
        "</section>"
    )


def render_report(report: dict[str, Any]) -> str:
    files = [as_dict(item, "file") for item in as_list(report.get("files"), "files")]
    verification = as_dict(report.get("verification", {}), "verification")
    baseline = as_dict(report.get("baseline", {}), "baseline")
    stats = as_dict(report.get("stats", {}), "stats")
    verdict = str(report.get("verdict", "approve-with-suggestions")).lower()
    if verdict not in VERDICT_LABELS:
        verdict = "approve-with-suggestions"
    verification_status = str(verification.get("status", "not-run")).lower()
    if verification_status not in VERIFICATION_LABELS:
        verification_status = "not-run"

    severity_counts: Counter[str] = Counter()
    for file_data in files:
        for comment in as_list(file_data.get("comments"), "comments"):
            severity = str(as_dict(comment, "comment").get("severity", "optional")).lower()
            if severity in SEVERITY_LABELS:
                severity_counts[severity] += 1

    nav_items = "".join(
        f'<a href="#file-{index}"><span>{index:02d}</span>'
        f'<span>{escaped(file_data.get("path", f"file-{index}"))}</span></a>'
        for index, file_data in enumerate(files, 1)
    )
    file_sections = "".join(
        render_file(file_data, index) for index, file_data in enumerate(files, 1)
    )
    verification_details = "".join(
        f"<li>{escaped(item)}</li>"
        for item in as_list(verification.get("details"), "verification.details")
    )
    count_cards = "".join(
        f'<div class="metric metric-{severity}"><span>{SEVERITY_LABELS[severity]}</span>'
        f'<strong>{severity_counts[severity]}</strong></div>'
        for severity in SEVERITY_LABELS
    )
    range_label = baseline.get("range") or (
        f'{baseline.get("start", "unknown")} → {baseline.get("current", "working tree")}'
    )

    title = escaped(report.get("title", "実装レビュー"))
    generated_at = escaped(
        report.get("generatedAt", datetime.now().astimezone().isoformat(timespec="minutes"))
    )
    stats_files = escaped(stats.get("filesChanged", len(files)))
    stats_additions = escaped(stats.get("additions", "—"))
    stats_deletions = escaped(stats.get("deletions", "—"))

    return f'''<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>{title}</title>
  <style>
    :root {{
      color-scheme: dark;
      --bg: #0b0d12;
      --surface: #12151d;
      --surface-2: #191d27;
      --border: #2a3040;
      --text: #eef1f7;
      --muted: #9ca5b7;
      --accent: #8b9dff;
      --critical: #ff6b7a;
      --warning: #ffbf69;
      --suggestion: #6db8ff;
      --optional: #9ba3b7;
      --success: #65d59a;
    }}
    * {{ box-sizing: border-box; }}
    html {{ scroll-behavior: smooth; }}
    body {{
      margin: 0;
      background:
        radial-gradient(circle at 15% 0%, rgba(139, 157, 255, .14), transparent 32rem),
        var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      line-height: 1.65;
    }}
    a {{ color: inherit; }}
    .page {{ max-width: 1440px; margin: 0 auto; padding: 44px 28px 80px; }}
    .eyebrow {{
      color: var(--accent); font: 700 12px/1 ui-monospace, monospace;
      letter-spacing: .14em; text-transform: uppercase;
    }}
    h1 {{ margin: 14px 0 8px; font-size: clamp(34px, 5vw, 66px); line-height: 1.04; }}
    .lede {{ max-width: 850px; color: var(--muted); font-size: 18px; }}
    .hero-meta {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }}
    .pill, .severity-badge, .file-status {{
      border: 1px solid var(--border); border-radius: 999px; padding: 5px 10px;
      background: rgba(255, 255, 255, .03); color: var(--muted); font-size: 12px;
    }}
    .verdict {{ color: var(--text); border-color: var(--accent); }}
    .summary-grid {{
      display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px;
      margin: 34px 0;
    }}
    .panel {{
      border: 1px solid var(--border); border-radius: 18px; padding: 20px;
      background: rgba(18, 21, 29, .86); box-shadow: 0 18px 50px rgba(0, 0, 0, .18);
    }}
    .panel h2 {{ margin: 0 0 12px; font-size: 14px; color: var(--muted); }}
    .big-number {{ font-size: 30px; font-weight: 760; }}
    .delta {{ display: flex; gap: 12px; margin-top: 6px; font-family: ui-monospace, monospace; }}
    .addition {{ color: var(--success); }} .deletion {{ color: var(--critical); }}
    .verification-passed {{ border-color: rgba(101, 213, 154, .5); }}
    .verification-failed {{ border-color: rgba(255, 107, 122, .5); }}
    .verification-partial {{ border-color: rgba(255, 191, 105, .5); }}
    .verification-state {{ font-size: 24px; font-weight: 750; }}
    .verification-command {{ color: var(--muted); font-family: ui-monospace, monospace; }}
    .verification-details {{ margin: 10px 0 0; color: var(--muted); padding-left: 18px; }}
    .metrics {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }}
    .metric {{ padding: 9px; border-radius: 10px; background: var(--surface-2); }}
    .metric span {{ display: block; color: var(--muted); font-size: 10px; }}
    .metric strong {{ display: block; margin-top: 2px; font-size: 23px; }}
    .content-grid {{ display: grid; grid-template-columns: 270px minmax(0, 1fr); gap: 24px; }}
    .sidebar {{ position: sticky; top: 20px; align-self: start; max-height: calc(100vh - 40px); overflow: auto; }}
    .sidebar h2 {{ margin: 0 0 12px; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .12em; }}
    .sidebar nav {{ display: grid; gap: 4px; }}
    .sidebar a {{
      display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 8px;
      padding: 8px; border-radius: 9px; text-decoration: none; color: var(--muted);
      font-size: 12px;
    }}
    .sidebar a:hover {{ background: var(--surface-2); color: var(--text); }}
    .sidebar a[aria-current="true"] {{ background: var(--surface-2); color: var(--text); }}
    .sidebar a span:last-child {{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
    .file-list {{ min-width: 0; }}
    .file-card {{
      scroll-margin-top: 20px; border: 1px solid var(--border); border-radius: 20px;
      padding: 24px; background: var(--surface); margin-bottom: 18px;
    }}
    .file-heading {{ display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }}
    .file-heading > div {{ display: flex; align-items: baseline; gap: 12px; min-width: 0; }}
    .file-index {{ color: var(--accent); font: 700 12px/1 ui-monospace, monospace; }}
    .file-heading h2 {{ margin: 0; overflow-wrap: anywhere; font: 650 20px/1.35 ui-monospace, monospace; }}
    .file-summary {{ margin: 16px 0 0; font-size: 17px; }}
    .file-details {{ color: var(--muted); }}
    .snippet {{ margin: 22px 0; border: 1px solid var(--border); border-radius: 13px; overflow: hidden; }}
    .snippet figcaption {{
      display: flex; justify-content: space-between; gap: 10px; padding: 9px 13px;
      background: var(--surface-2); color: var(--muted); font-size: 12px;
    }}
    pre {{ margin: 0; overflow: auto; padding: 12px 0; background: #0d1017; }}
    code {{ display: grid; min-width: max-content; font: 12px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; }}
    .code-line {{ display: grid; grid-template-columns: 56px minmax(0, 1fr); padding-right: 18px; }}
    .code-line--focus {{ background: rgba(139, 157, 255, .1); border-left: 2px solid var(--accent); }}
    .line-number {{ color: #596174; text-align: right; padding-right: 14px; user-select: none; }}
    .line-source {{ white-space: pre; }}
    .omission {{ padding: 6px 14px; color: var(--muted); background: #0d1017; font-size: 11px; }}
    .comments {{ margin-top: 26px; }} .comments > h3 {{ font-size: 13px; color: var(--muted); }}
    .review-comment {{
      --severity: var(--optional); border: 1px solid var(--border); border-left: 3px solid var(--severity);
      border-radius: 12px; padding: 15px 17px; margin-top: 10px; background: rgba(255, 255, 255, .018);
    }}
    .severity-critical {{ --severity: var(--critical); }}
    .severity-warning {{ --severity: var(--warning); }}
    .severity-suggestion {{ --severity: var(--suggestion); }}
    .severity-optional {{ --severity: var(--optional); }}
    .comment-heading {{ display: flex; gap: 9px; align-items: center; }}
    .severity-badge {{ color: var(--severity); border-color: var(--severity); }}
    .comment-location {{ color: var(--muted); font: 12px/1 ui-monospace, monospace; }}
    .review-comment h4 {{ margin: 11px 0 5px; font-size: 16px; }}
    .review-comment p {{ margin: 0; color: var(--muted); }}
    .review-comment dl {{ margin: 13px 0 0; display: grid; gap: 8px; }}
    .comment-detail {{ display: grid; grid-template-columns: 58px minmax(0, 1fr); gap: 8px; }}
    .comment-detail dt {{ color: var(--text); font-size: 12px; font-weight: 700; }}
    .comment-detail dd {{ margin: 0; color: var(--muted); font-size: 13px; }}
    .no-findings {{ color: var(--success); font-size: 13px; }}
    footer {{ margin-top: 38px; text-align: center; color: var(--muted); font-size: 12px; }}
    @media (max-width: 900px) {{
      .summary-grid {{ grid-template-columns: 1fr; }}
      .content-grid {{ grid-template-columns: 1fr; }}
      .sidebar {{ position: static; max-height: none; }}
      .sidebar nav {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
    }}
    @media (max-width: 560px) {{
      .page {{ padding: 28px 16px 60px; }}
      .metrics {{ grid-template-columns: repeat(2, 1fr); }}
      .sidebar nav {{ grid-template-columns: 1fr; }}
      .file-card {{ padding: 18px; }}
      .file-heading {{ display: grid; }}
    }}
    @media (prefers-reduced-motion: reduce) {{ html {{ scroll-behavior: auto; }} }}
  </style>
</head>
<body>
  <main class="page">
    <header>
      <div class="eyebrow">Implementation review</div>
      <h1>{title}</h1>
      <p class="lede">{escaped(report.get("summary", ""))}</p>
      <div class="hero-meta">
        <span class="pill verdict">{VERDICT_LABELS[verdict]}</span>
        <span class="pill">{escaped(range_label)}</span>
        <span class="pill">{generated_at}</span>
      </div>
    </header>

    <section class="summary-grid" aria-label="レビュー概要">
      <article class="panel">
        <h2>Changed files</h2>
        <div class="big-number">{stats_files}</div>
        <div class="delta"><span class="addition">+{stats_additions}</span><span class="deletion">−{stats_deletions}</span></div>
      </article>
      <article class="panel verification-{verification_status}">
        <h2>Verification</h2>
        <div class="verification-state">{VERIFICATION_LABELS[verification_status]}</div>
        <div class="verification-command">{escaped(verification.get("command", ""))}</div>
        <p>{escaped(verification.get("summary", ""))}</p>
        <ul class="verification-details">{verification_details}</ul>
      </article>
      <article class="panel">
        <h2>Review findings</h2>
        <div class="metrics">{count_cards}</div>
      </article>
    </section>

    <div class="content-grid">
      <aside class="sidebar panel">
        <h2>Changed files</h2>
        <nav>{nav_items}</nav>
      </aside>
      <div class="file-list">{file_sections}</div>
    </div>
    <footer>Generated by review-implementation · Source values are HTML-escaped and secret patterns are redacted.</footer>
  </main>
  <script>
    const links = new Map(
      [...document.querySelectorAll('.sidebar a')].map((link) => [link.hash.slice(1), link])
    );
    const observer = new IntersectionObserver((entries) => {{
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      links.forEach((link, id) => {{
        if (id === visible.target.id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }});
    }}, {{ rootMargin: '-15% 0px -70% 0px' }});
    document.querySelectorAll('.file-card').forEach((section) => observer.observe(section));
  </script>
</body>
</html>'''


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", help="JSON file path, or - for stdin")
    parser.add_argument("--output", type=Path, help="Path inside .agents/review")
    parser.add_argument("--open", action="store_true", help="Open the generated file")
    parser.add_argument("--print-schema", action="store_true", help="Print example JSON")
    args = parser.parse_args()
    if not args.print_schema and not args.input:
        parser.error("--input is required unless --print-schema is used")
    return args


def main() -> int:
    args = parse_args()
    if args.print_schema:
        print(json.dumps(SCHEMA, ensure_ascii=False, indent=2))
        return 0

    try:
        report = load_report(args.input)
        requested_output = ensure_review_output(
            args.output or default_output_path(report.get("title"))
        )
        output = write_report(requested_output, render_report(report))
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1

    print(output)
    if args.open and not webbrowser.open(output.as_uri()):
        print("warning: browser could not be opened; use the path above", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
