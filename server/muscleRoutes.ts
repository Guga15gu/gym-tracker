import type { Pool } from "pg";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readBody, sendJson } from "./httpUtils.ts";
import { pgErrorToStatus } from "./pgErrors.ts";
import { validateMuscleBody } from "./data/muscle.ts";

type MuscleRow = { id: string; name: string };

export async function handleMuscles(pool: Pool, res: ServerResponse) {
  const result = await pool.query<MuscleRow>("SELECT id, name FROM muscles");

  return sendJson(res, 200, result.rows);
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
      return sendJson(res, 204);
    }
    return sendJson(res, 404);
  } catch (err) {
    const status = pgErrorToStatus(err);

    return sendJson(res, status);
  }
}

export async function handlePatchMuscle(
  pool: Pool,
  id: string,
  req: IncomingMessage,
  res: ServerResponse,
) {
  const body = await readBody(req);
  const validation = validateMuscleBody(body);

  if (validation.kind === "error") {
    return sendJson(res, validation.status, { error: validation.message });
  }

  try {
    const query =
      "UPDATE muscles SET name = $1 WHERE id = $2 RETURNING id, name";
    const result = await pool.query(query, [validation.name, id]);
    if (result.rowCount === 1) {
      return sendJson(res, 200, result.rows[0]);
    }
    return sendJson(res, 404);
  } catch (err) {
    const status = pgErrorToStatus(err);

    return sendJson(res, status);
  }
}

export async function handleAddMuscle(
  pool: Pool,
  req: IncomingMessage,
  res: ServerResponse,
) {
  const body = await readBody(req);
  const validation = validateMuscleBody(body);

  if (validation.kind === "error") {
    return sendJson(res, validation.status, { error: validation.message });
  }

  try {
    const query = "INSERT INTO muscles(name) VALUES($1) RETURNING id, name";
    const result = await pool.query(query, [validation.name]);

    return sendJson(res, 201, result.rows[0]);
  } catch (err) {
    const status = pgErrorToStatus(err);

    return sendJson(res, status);
  }
}
