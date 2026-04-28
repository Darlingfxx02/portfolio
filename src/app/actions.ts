"use server";

import { incrementClickCount } from "@/lib/db";

export async function incrementClicks(): Promise<number> {
  return incrementClickCount();
}
