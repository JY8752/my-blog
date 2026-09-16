"use client";

import {
  setPinnedEntryAction,
  type SetPinnedEntryState,
} from "@/app/admin/scraps/[id]/_actions/setPinnedEntry";
import { useActionState } from "react";

const initialState: SetPinnedEntryState = { error: "" };

export function ScrapEntryPinButton({
  scrapId,
  entryId,
  isPinned,
}: {
  scrapId: string;
  entryId: string;
  isPinned: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    setPinnedEntryAction.bind(null, scrapId, entryId, !isPinned),
    initialState,
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        aria-pressed={isPinned}
        className="inline-flex min-h-11 items-center rounded-md border border-outline px-4 font-label text-xs font-bold text-on-surface-variant transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "変更中…" : isPinned ? "ピン留めを解除" : "先頭にピン留め"}
      </button>
      {state.error ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
