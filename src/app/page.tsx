"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 dark:bg-black">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Portfolio
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Hello world. Clicks: {count}
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Hello World
      </button>
    </main>
  );
}
