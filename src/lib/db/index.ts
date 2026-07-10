import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env.local file or environment variables."
    );
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof getDb>;

let _db: Database | null = null;

export function getDatabase(): Database {
  if (!_db) {
    _db = getDb();
  }
  return _db;
}

// For backward compatibility
export const db = new Proxy({} as Database, {
  get(_, prop) {
    return (getDatabase() as any)[prop];
  },
});
