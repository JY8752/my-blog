"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ScrapDeleteButton({
  scrapId,
  scrapTitle,
}: {
  scrapId: string;
  scrapTitle: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      isDeleting ||
      !window.confirm(`「${scrapTitle}」を削除しますか？\nこの操作は取り消せません。`)
    ) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/scraps/${scrapId}`, {
        method: "DELETE",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message ?? "スクラップを削除できませんでした。");
      }

      router.push("/admin/scraps");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "スクラップを削除できませんでした。",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex min-h-11 items-center rounded-md border border-error px-5 font-label text-xs font-bold text-error transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "削除中…" : "スクラップを削除"}
      </button>
      {error ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
