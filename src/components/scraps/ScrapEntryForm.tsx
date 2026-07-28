"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { MarkdownComposer } from "./MarkdownComposer";

export function ScrapEntryForm({ scrapId }: { scrapId: string }) {
  const router = useRouter();
  const [bodyMarkdown, setBodyMarkdown] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/scraps/${scrapId}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ bodyMarkdown }),
      });
      const result = (await response.json()) as {
        entry?: { id: string };
        message?: string;
      };

      if (!response.ok || !result.entry) {
        throw new Error(result.message ?? "投稿を追加できませんでした。");
      }

      setBodyMarkdown("");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "投稿を追加できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <MarkdownComposer
        value={bodyMarkdown}
        onChange={setBodyMarkdown}
        disabled={isSubmitting}
        label="Markdown"
        compact
      />
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
          disabled={isSubmitting || !bodyMarkdown.trim()}
          className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-label text-xs font-bold tracking-data text-on-primary transition-colors hover:bg-primary-fixed-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "追加中…" : "投稿を追加"}
        </button>
      </div>
    </form>
  );
}
