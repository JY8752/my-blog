"use client";

import { type ClipboardEvent, useEffect, useId, useRef, useState } from "react";
import { Blog } from "@/app/_components/Blog";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const latestValue = useRef(value);
  latestValue.current = value;

  const updateValue = (nextValue: string) => {
    latestValue.current = nextValue;
    onChange(nextValue);
  };

  const handlePaste = async (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const images = Array.from(event.clipboardData.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (images.length === 0) return;

    event.preventDefault();
    setUploadError("");
    setIsUploading(true);

    const { selectionStart, selectionEnd } = event.currentTarget;
    const tokens = images.map(() => `<!-- scrap-image-upload:${crypto.randomUUID()} -->`);
    const insertion = tokens.join("\n");
    const currentValue = latestValue.current;
    updateValue(
      `${currentValue.slice(0, selectionStart)}${insertion}${currentValue.slice(selectionEnd)}`,
    );

    try {
      for (const [index, image] of images.entries()) {
        const formData = new FormData();
        formData.set("image", image);
        const response = await fetch("/api/admin/scrap-images", {
          method: "POST",
          headers: { "X-Requested-With": "XMLHttpRequest" },
          body: formData,
        });
        const result = (await response.json()) as { url?: string; message?: string };
        if (!response.ok || !result.url) {
          throw new Error(result.message ?? "画像をアップロードできませんでした。");
        }

        const alt = (image.name || "画像").replaceAll("[", "").replaceAll("]", "");
        updateValue(latestValue.current.replace(tokens[index], `![${alt}](${result.url})`));
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "画像をアップロードできませんでした。",
      );
      updateValue(
        tokens.reduce((markdown, token) => markdown.replace(token, ""), latestValue.current),
      );
    } finally {
      setIsUploading(false);
    }
  };

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
            onChange={(event) => updateValue(event.target.value)}
            onPaste={handlePaste}
            disabled={disabled}
            maxLength={50_000}
            spellCheck="false"
            placeholder={`Markdownで記録を書きます。\n\nURLだけの行はリンクカードとして表示されます。`}
            className={`w-full resize-y rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-mono text-sm leading-7 text-on-surface outline-none transition-shadow placeholder:text-tertiary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60 ${
              compact ? "min-h-[18rem]" : "min-h-[28rem]"
            }`}
          />
          <p className="mt-2 text-right font-label text-label-sm text-tertiary">
            {isUploading ? "画像をアップロード中… · " : null}
            {value.length.toLocaleString()} / 50,000
          </p>
          {uploadError ? (
            <p role="alert" className="mt-2 text-sm text-error">
              {uploadError}
            </p>
          ) : (
            <p className="mt-2 text-xs text-tertiary">
              画像を貼り付けるとMarkdownへ挿入できます（最大10MB）。
            </p>
          )}
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
