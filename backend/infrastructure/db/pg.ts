import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (!databaseUrl) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<{ rows: T[] }> {
  const p = getPool();
  if (!p) {
    throw new Error("DATABASE_URL not configured");
  }
  const res = await p.query(text, params);
  return { rows: res.rows as T[] };
}
