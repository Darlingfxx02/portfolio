import { connection } from "next/server";
import { getClickCount } from "@/lib/db";
import { ClickCounter } from "./click-counter";

export default async function Home() {
  await connection();
  const initialCount = getClickCount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 dark:bg-black">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Portfolio
      </h1>
      <ClickCounter initialCount={initialCount} />
    </main>
  );
}
