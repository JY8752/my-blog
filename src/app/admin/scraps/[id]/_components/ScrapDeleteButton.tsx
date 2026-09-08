"use client";

import {
  deleteScrapAction,
  type DeleteScrapState,
} from "@/app/admin/scraps/[id]/_actions/deleteScrap";
import { useActionState } from "react";

const initialState: DeleteScrapState = { error: "" };

export function ScrapDeleteButton({
  scrapId,
  scrapTitle,
}: {
  scrapId: string;
  scrapTitle: string;
}) {
  const [state, formAction, isPending] = useActionState(
    deleteScrapAction.bind(null, scrapId),
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`「${scrapTitle}」を削除しますか？\nこの操作は取り消せません。`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center rounded-md border border-error px-5 font-label text-xs font-bold text-error transition-colors hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "削除中…" : "スクラップを削除"}
      </button>
      {state.error ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
