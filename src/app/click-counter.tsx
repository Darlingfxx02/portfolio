"use client";

import { useState, useTransition } from "react";
import { incrementClicks } from "./actions";

export function ClickCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const next = await incrementClicks();
      setCount(next);
    });
  }

  return (
    <>
      <p className="text-zinc-600 dark:text-zinc-400">
        Hello world. Clicks: {count}
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Hello World
      </button>
    </>
  );
}
