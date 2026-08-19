import { test } from "node:test";
import assert from "node:assert/strict";
import { pgErrorToResponse } from "./pgErrors.ts";

test("maps unique violation (23505) to 409", () => {
  const err = Object.assign(new Error("duplicate key"), { code: "23505" });

  assert.equal(pgErrorToResponse(err).status, 409);
});

test("maps invalid uuid (22P02) to 400", () => {
  const err = Object.assign(new Error("invalid uuid"), { code: "22P02" });

  assert.equal(pgErrorToResponse(err).status, 400);
});

test("maps without code to 500", () => {
  const err = Object.assign(new Error("without code"));

  assert.equal(pgErrorToResponse(err).status, 500);
});

test("maps not string code to 500", () => {
  const err = Object.assign(new Error("without code"), { code: 23505 });

  assert.equal(pgErrorToResponse(err).status, 500);
});

test("maps not code to 500", () => {
  const err = Object.assign(new Error("without code"), { test: 23505 });

  assert.equal(pgErrorToResponse(err).status, 500);
});

test("maps not-object input to 500", () => {
  const err = Object.assign(new Error("without code"), 23505);

  assert.equal(pgErrorToResponse(err).status, 500);
});
