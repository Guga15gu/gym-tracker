import type { Pool } from "pg";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readBody } from "./httpUtils.ts";

type MuscleRow = { id: string; name: string };

export async function handleMuscles(pool: Pool, res: ServerResponse) {
  const result = await pool.query<MuscleRow>("SELECT id, name FROM muscles");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(result.rows));
}

export async function handleDeleteMuscle(
  pool: Pool,
  id: string,
  res: ServerResponse,
) {
  try {
    const query = "DELETE FROM muscles WHERE id = $1";
    const result = await pool.query(query, [id]);
    if (result.rowCount === 1) {
      res.writeHead(204);
      return res.end();
    }
    res.writeHead(404);
    return res.end();
  } catch (err) {
    console.error(err);

    if (err instanceof Error && "code" in err && err.code === "22P02") {
      res.writeHead(400);
      return res.end();
    }
    res.writeHead(500);
    return res.end();
  }
}

export async function handleAddMuscle(
  pool: Pool,
  req: IncomingMessage,
  res: ServerResponse,
) {
  const body = await readBody(req);

  if (
    !body ||
    typeof body !== "object" ||
    !("name" in body) ||
    typeof body.name !== "string"
  ) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "name is not string" }));
  }

  if (body.name.trim() === "") {
    res.writeHead(422);
    return res.end(JSON.stringify({ error: "name is empty" }));
  }

  try {
    const query = "INSERT INTO muscles(name) VALUES($1) RETURNING id, name";
    const result = await pool.query(query, [body.name]);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result.rows));
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      res.writeHead(409);
      return res.end();
    } else {
      res.writeHead(500);
      return res.end();
    }
  }
}
