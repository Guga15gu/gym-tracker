import test, { beforeEach, after } from "node:test";
import { router } from "./router.ts";
import { createServer } from "node:http";
import assert from "node:assert/strict";
import { testPool } from "./test_db.ts";
import type { Pool } from "pg";

after(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await testPool.query("TRUNCATE muscles");
});

export async function startServer() {
  const server = createServer((req, res) => {
    return router(req, res, testPool);
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

type MuscleRow = { id: string; name: string };
async function seedMuscles(pool: Pool, names: string[]) {
  const expected: MuscleRow[] = [];

  for (const name of names) {
    const query = "INSERT INTO muscles(name) VALUES($1) RETURNING id, name";
    const result = await pool.query<MuscleRow>(query, [name]);
    expected.push(result.rows[0]);
  }
  return expected;
}

test("GET /muscles", async (t) => {
  const expect = await seedMuscles(testPool, ["Chest", "Back"]);

  const { server, port, hostname } = await startServer();

  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const res = await fetch(`http://${hostname}:${port}/muscles`);
  const body = await res.json();

  assert.equal(res.status, 200);

  assert.deepEqual(body, expect);
});
