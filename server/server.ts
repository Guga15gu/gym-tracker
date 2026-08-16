import { createServer } from "node:http";
import { handleAddMuscle, handleMuscles } from "./muscleRoutes.ts";
import { pool } from "./db.ts";

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/muscles") {
    return handleMuscles(pool, res);
  }
  if (req.method === "POST" && req.url === "/muscles") {
    return handleAddMuscle(pool, req, res);
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
