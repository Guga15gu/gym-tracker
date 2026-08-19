import { IncomingMessage, ServerResponse } from "node:http";
import {
  handleAddMuscle,
  handleDeleteMuscle,
  handleMuscles,
  handlePatchMuscle,
} from "./muscleRoutes.ts";
import { sendJson } from "./httpUtils.ts";
import type { Pool } from "pg";

export function router(req: IncomingMessage, res: ServerResponse, pool: Pool) {
  const parts = new URL(req.url ?? "/", "http://localhost").pathname.split("/");
  if (parts[1] === "muscles") {
    if (parts.length === 2) {
      if (req.method === "GET") {
        return handleMuscles(pool, res);
      }
      if (req.method === "POST") {
        return handleAddMuscle(pool, req, res);
      }
    }
    if (parts.length === 3 && parts[2] !== "") {
      const id = parts[2];
      if (req.method === "DELETE") {
        return handleDeleteMuscle(pool, id, res);
      }
      if (req.method === "PATCH") {
        return handlePatchMuscle(pool, id, req, res);
      }
    }
  }

  return sendJson(res, { status: 404, payload: { error: "Not found" } });
}
