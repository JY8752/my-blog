"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { slugify } from "../../lib/scraps/validation";
import { MarkdownComposer } from "./MarkdownComposer";

interface ApiError {
  message?: string;
  fields?: Record<string, string>;
}

export function ScrapCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [tags, setTags] = useState("");
  const [bodyMarkdown, setBodyMarkdown] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isSlugEdited) setSlug(slugify(value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/admin/scraps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          title,
          slug,
          tags: tags
            .split(/[,、]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
          bodyMarkdown,
        }),
      });
      const result = (await response.json()) as ApiError & { scrap?: { id: string } };

      if (!response.ok || !result.scrap) {
        setFieldErrors(result.fields ?? {});
        throw new Error(result.message ?? "スクラップを作成できませんでした。");
      }

      router.push(`/admin/scraps/${result.scrap.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "スクラップを作成できませんでした。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="scrap-title" className="font-label text-xs font-semibold">
            タイトル
          </label>
          <input
            id="scrap-title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            maxLength={100}
            required
            className="mt-2 min-h-12 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 text-base outline-none transition-shadow focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
          />
          {fieldErrors.title ? (
            <p className="mt-2 text-xs text-error">{fieldErrors.title}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="scrap-slug" className="font-label text-xs font-semibold">
            slug
          </label>
          <input
            id="scrap-slug"
            value={slug}
            onChange={(event) => {
              setIsSlugEdited(true);
              setSlug(event.target.value.toLocaleLowerCase());
            }}
            maxLength={80}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="空欄なら自動生成"
            className="mt-2 min-h-12 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 font-mono text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
          />
          {fieldErrors.slug ? (
            <p className="mt-2 text-xs text-error">{fieldErrors.slug}</p>
          ) : (
            <p className="mt-2 text-xs text-tertiary">英小文字・数字・ハイフンのみ</p>
          )}
        </div>

        <div>
          <label htmlFor="scrap-tags" className="font-label text-xs font-semibold">
            タグ
          </label>
          <input
            id="scrap-tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Go, Cloudflare, D1"
            className="mt-2 min-h-12 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
          />
          {fieldErrors.tags ? (
            <p className="mt-2 text-xs text-error">{fieldErrors.tags}</p>
          ) : (
            <p className="mt-2 text-xs text-tertiary">カンマ区切り、最大5個</p>
          )}
        </div>
      </div>

      <div>
        <MarkdownComposer
          value={bodyMarkdown}
          onChange={setBodyMarkdown}
          disabled={isSubmitting}
          label="最初の投稿"
        />
        {fieldErrors.bodyMarkdown ? (
          <p className="mt-2 text-xs text-error">{fieldErrors.bodyMarkdown}</p>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-error/30 bg-error/10 p-4 text-sm text-error"
        >
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-label text-xs font-bold tracking-data text-on-primary transition-colors hover:bg-primary-fixed-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "作成中…" : "スクラップを作成"}
        </button>
      </div>
    </form>
  );
}
