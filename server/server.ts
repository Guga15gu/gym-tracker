import { createServer } from "node:http";
import { router } from "./router.ts";
import { pool } from "./db.ts";

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {
  return router(req, res, pool);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
