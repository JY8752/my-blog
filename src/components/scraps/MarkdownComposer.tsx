"use client";

import { useEffect, useId, useState } from "react";
import { Blog } from "../Blog";

interface MarkdownComposerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  compact?: boolean;
}

export function MarkdownComposer({
  value,
  onChange,
  label = "投稿本文",
  disabled = false,
  compact = false,
}: MarkdownComposerProps) {
  const id = useId();
  const [html, setHtml] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (!value.trim()) {
      setHtml("");
      setPreviewError("");
      setIsPreviewing(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsPreviewing(true);
      setPreviewError("");

      try {
        const response = await fetch("/api/admin/markdown-preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ bodyMarkdown: value }),
          signal: controller.signal,
        });
        const result = (await response.json()) as { html?: string; message?: string };

        if (!response.ok || typeof result.html !== "string") {
          throw new Error(result.message ?? "プレビューを生成できませんでした。");
        }
        setHtml(result.html);
      } catch (error) {
        if (controller.signal.aborted) return;
        setPreviewError(
          error instanceof Error ? error.message : "プレビューを生成できませんでした。",
        );
      } finally {
        if (!controller.signal.aborted) setIsPreviewing(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [value]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <label htmlFor={id} className="font-label text-xs font-semibold text-on-surface">
          {label}
        </label>
        <div className="flex rounded-md border border-outline-variant p-1 lg:hidden">
          {(["edit", "preview"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={`min-h-9 rounded-sm px-3 font-label text-label-sm transition-colors ${
                mobileTab === tab
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab === "edit" ? "編集" : "プレビュー"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className={mobileTab === "edit" ? "block" : "hidden lg:block"}>
          <textarea
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            maxLength={50_000}
            spellCheck="false"
            placeholder={`Markdownで記録を書きます。\n\nURLだけの行はリンクカードとして表示されます。`}
            className={`w-full resize-y rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-mono text-sm leading-7 text-on-surface outline-none transition-shadow placeholder:text-tertiary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60 ${
              compact ? "min-h-[18rem]" : "min-h-[28rem]"
            }`}
          />
          <p className="mt-2 text-right font-label text-label-sm text-tertiary">
            {value.length.toLocaleString()} / 50,000
          </p>
        </div>

        <div
          className={`rounded-lg border border-outline-variant bg-surface-container-lowest p-4 sm:p-6 ${
            mobileTab === "preview" ? "block" : "hidden lg:block"
          } ${compact ? "min-h-[18rem]" : "min-h-[28rem]"}`}
          aria-live="polite"
          aria-busy={isPreviewing}
        >
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-outline-variant pb-3">
            <p className="font-label text-label-sm font-semibold tracking-label text-tertiary uppercase">
              Preview
            </p>
            {isPreviewing ? (
              <span className="font-label text-label-sm text-tertiary">変換中…</span>
            ) : null}
          </div>

          {previewError ? (
            <p className="rounded-md border border-error/30 bg-error/10 p-4 text-sm text-error">
              {previewError}
            </p>
          ) : html ? (
            <div className="article-content">
              <Blog html={html} />
            </div>
          ) : (
            <p className="text-sm leading-7 text-tertiary">
              Markdownを入力すると、ここにプレビューが表示されます。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
