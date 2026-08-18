import test from "node:test";
import { router } from "./router.ts";
import { createServer } from "node:http";
import { pool } from "./db.ts";
import assert from "node:assert/strict";
import { after } from "node:test";

after(async () => {
  await pool.end();
});

export async function startServer() {
  const server = createServer((req, res) => {
    return router(req, res, pool);
  });
  const hostname = "127.0.0.1";

  const port = await new Promise<number>((resolve) => {
    server.listen(0, hostname, () => {
      const address = server.address();
      if (address && typeof address === "object") {
        resolve(address.port);
      }
    });
  });

  return { server, port, hostname };
}

test("GET /muscles", async (t) => {
  const { server, port, hostname } = await startServer();

  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const res = await fetch(`http://${hostname}:${port}/muscles`);

  const body = await res.json();

  assert.equal(res.status, 200);

  const expect = [
    {
      id: "6bc6253d-4649-47c7-8a36-f2884d9cc1c6",
      name: "Peito",
    },
    {
      id: "f43b00b3-c9ff-4ada-b3fd-f4a72de27931",
      name: "Chest",
    },
  ];
  assert.deepEqual(body, expect);
});
