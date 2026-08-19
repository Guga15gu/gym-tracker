import test, { beforeEach, after, describe } from "node:test";
import { router } from "./router.ts";
import { createServer } from "node:http";
import assert from "node:assert/strict";
import { testPool } from "./test_db.ts";
import type { Pool } from "pg";
import { randomUUID } from "node:crypto";

after(async () => {
  await testPool.end();
});

beforeEach(async () => {
  await testPool.query("TRUNCATE muscles");
});

async function startServer() {
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

test("Invalid route", async (t) => {
  const { server, port, hostname } = await startServer();

  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const res = await fetch(`http://${hostname}:${port}/muscles2`);

  assert.equal(res.status, 404);
});

describe("POST /muscles", () => {
  test("201, ok", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const res = await fetch(`http://${hostname}:${port}/muscles`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Chest" }),
    });
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.ok(body.id, "Id not exists");
    assert.ok(typeof body.id === "string", "Id is not a string");

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
    assert.deepEqual(result.rows, [{ id: body.id, name: "Chest" }]);
  });

  test("201, muscle name is trimmed", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const res = await fetch(`http://${hostname}:${port}/muscles`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "   Chest   " }),
    });
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.ok(body.id, "Id not exists");
    assert.ok(typeof body.id === "string", "Id is not a string");

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
    assert.deepEqual(result.rows, [{ id: body.id, name: "Chest" }]);
  });

  test("409, duplicated muscle name", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const muscle = await seedMuscles(testPool, ["Chest"]);

    const res = await fetch(`http://${hostname}:${port}/muscles`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Chest" }),
    });

    assert.equal(res.status, 409);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
    assert.deepEqual(result.rows, [{ id: muscle[0].id, name: "Chest" }]);
  });

  test("422, empty muscle name", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const res = await fetch(`http://${hostname}:${port}/muscles`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "  " }),
    });

    assert.equal(res.status, 422);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 0);
  });

  test("400, not string muscle name", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const res = await fetch(`http://${hostname}:${port}/muscles`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: 123 }),
    });

    assert.equal(res.status, 400);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 0);
  });
});

describe("DELETE /muscles", () => {
  test("204, ok", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const muscle = await seedMuscles(testPool, ["Chest"]);

    const res = await fetch(
      `http://${hostname}:${port}/muscles/${muscle[0].id}`,
      {
        method: "DELETE",
      },
    );

    assert.equal(res.status, 204);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 0);
  });

  test("404, inexistent id", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    await seedMuscles(testPool, ["Chest"]);
    const fakeUUID = randomUUID();
    const res = await fetch(`http://${hostname}:${port}/muscles/${fakeUUID}`, {
      method: "DELETE",
    });

    assert.equal(res.status, 404);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
  });

  test("400, invalid id", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    await seedMuscles(testPool, ["Chest"]);

    const res = await fetch(`http://${hostname}:${port}/muscles/adsfasdf`, {
      method: "DELETE",
    });

    assert.equal(res.status, 400);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
  });
});

describe("PATCH /muscles", () => {
  test("200, ok", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const muscle = await seedMuscles(testPool, ["Chest"]);

    const res = await fetch(
      `http://${hostname}:${port}/muscles/${muscle[0].id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Back" }),
      },
    );

    assert.equal(res.status, 200);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
    assert.deepEqual(result.rows, [{ id: muscle[0].id, name: "Back" }]);
  });

  test("422, empty muscle name", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const muscle = await seedMuscles(testPool, ["Chest"]);

    const res = await fetch(
      `http://${hostname}:${port}/muscles/${muscle[0].id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "  " }),
      },
    );

    assert.equal(res.status, 422);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
    assert.deepEqual(result.rows, [{ id: muscle[0].id, name: "Chest" }]);
  });

  test("404, inexistent id", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const muscle = await seedMuscles(testPool, ["Chest"]);
    const fakeUUID = randomUUID();
    const res = await fetch(`http://${hostname}:${port}/muscles/${fakeUUID}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Back" }),
    });

    assert.equal(res.status, 404);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
    assert.deepEqual(result.rows, [{ id: muscle[0].id, name: "Chest" }]);
  });

  test("400, invalid id", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const muscle = await seedMuscles(testPool, ["Chest"]);

    const res = await fetch(`http://${hostname}:${port}/muscles/sdaf43`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Back" }),
    });

    assert.equal(res.status, 400);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles",
    );
    assert.equal(result.rowCount, 1);
    assert.deepEqual(result.rows, [{ id: muscle[0].id, name: "Chest" }]);
  });

  test("409, duplicated muscle name", async (t) => {
    const { server, port, hostname } = await startServer();

    t.after(() => {
      server.closeAllConnections();
      server.close();
    });

    const muscles = await seedMuscles(testPool, ["Back", "Chest"]);

    const res = await fetch(
      `http://${hostname}:${port}/muscles/${muscles[0].id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Chest" }),
      },
    );

    assert.equal(res.status, 409);

    const result = await testPool.query<MuscleRow>(
      "SELECT id, name FROM muscles ORDER BY name",
    );
    assert.equal(result.rowCount, 2);
    assert.deepEqual(result.rows[0], { id: muscles[0].id, name: "Back" });
    assert.deepEqual(result.rows[1], { id: muscles[1].id, name: "Chest" });
  });
});
