import { createServer } from "node:http";
import {
  handleAddMuscle,
  handleDeleteMuscle,
  handleMuscles,
  handlePatchMuscle,
} from "./muscleRoutes.ts";
import { pool } from "./db.ts";

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {
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

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
