import fs from "fs";
import path from "path";
import { getPool } from "./pg";

async function run() {
  const pool = getPool();
  if (!pool) {
    console.error("DATABASE_URL not configured; skipping migrations.");
    process.exit(0);
  }
  const dir = path.join(import.meta.dirname, "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), "utf-8");
    console.info(`Applying migration ${f}`);
    await pool.query(sql);
  }
  console.info("Migrations applied");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
