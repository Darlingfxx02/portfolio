import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH
  ? resolve(process.env.DATABASE_PATH)
  : resolve(process.cwd(), "data", "counter.db");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS counters (
    name TEXT PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0
  );
  INSERT OR IGNORE INTO counters (name, value) VALUES ('global_clicks', 0);
`);

const selectStmt = db.prepare<[string], { value: number }>(
  "SELECT value FROM counters WHERE name = ?",
);
const incrementStmt = db.prepare<[string], { value: number }>(
  "UPDATE counters SET value = value + 1 WHERE name = ? RETURNING value",
);

const COUNTER_NAME = "global_clicks";

export function getClickCount(): number {
  return selectStmt.get(COUNTER_NAME)?.value ?? 0;
}

export function incrementClickCount(): number {
  const row = incrementStmt.get(COUNTER_NAME);
  if (!row) throw new Error("counter row missing");
  return row.value;
}
