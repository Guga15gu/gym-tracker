import type { Pool } from "pg";
import type { ServerResponse } from "node:http";

type MuscleRow = { id: string; name: string };

export async function handleMuscles(pool: Pool, res: ServerResponse) {
  const result = await pool.query<MuscleRow>("SELECT id, name FROM muscles");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(result.rows));
}
