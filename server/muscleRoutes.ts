import type { Pool } from "pg";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readBody, send204, sendJson } from "./httpUtils.ts";
import { pgErrorToResponse } from "./pgErrors.ts";
import { validateMuscleBody } from "./data/muscle.ts";

type MuscleRow = { id: string; name: string };

export async function handleMuscles(pool: Pool, res: ServerResponse) {
  const result = await pool.query<MuscleRow>("SELECT id, name FROM muscles");

  return sendJson(res, { status: 200, payload: result.rows });
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
      return send204(res);
    }

    return sendJson(res, { status: 404, payload: { error: "Not found" } });
  } catch (err) {
    return sendJson(res, pgErrorToResponse(err));
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
    return sendJson(res, {
      status: validation.status,
      payload: validation.payload,
    });
  }

  try {
    const query =
      "UPDATE muscles SET name = $1 WHERE id = $2 RETURNING id, name";
    const result = await pool.query(query, [validation.name, id]);
    if (result.rowCount === 1) {
      return sendJson(res, { status: 200, payload: result.rows[0] });
    }
    return sendJson(res, { status: 404, payload: { error: "Not found" } });
  } catch (err) {
    const response = pgErrorToResponse(err);

    return sendJson(res, response);
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
    return sendJson(res, {
      status: validation.status,
      payload: validation.payload,
    });
  }

  try {
    const query = "INSERT INTO muscles(name) VALUES($1) RETURNING id, name";
    const result = await pool.query(query, [validation.name]);

    return sendJson(res, { status: 201, payload: result.rows[0] });
  } catch (err) {
    const response = pgErrorToResponse(err);

    return sendJson(res, response);
  }
}
