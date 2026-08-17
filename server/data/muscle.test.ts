import { test } from "node:test";
import assert from "node:assert/strict";
import { validateMuscleBody } from "./muscle.ts";

function err(status: number, message: string) {
  return {
    kind: "error",
    status: status,
    message: message,
  };
}

const cases: Array<[unknown, unknown]> = [
  [null, err(400, "name is not string")],
  ["string", err(400, "name is not string")],
  [[42, true, []], err(400, "name is not string")],
  [{}, err(400, "name is not string")],
  [{ name: 42 }, err(400, "name is not string")],
  [{ name: "" }, err(422, "name is empty")],
  [{ name: " " }, err(422, "name is empty")],
  [{ name: "Chest" }, { kind: "success", name: "Chest" }],
  [{ name: " Chest" }, { kind: "success", name: "Chest" }],
  [{ name: "Chest " }, { kind: "success", name: "Chest" }],
];

for (const [input, expected] of cases) {
  test(`rejects ${JSON.stringify(input)}`, () => {
    assert.deepEqual(validateMuscleBody(input), expected);
  });
}

test("accepts valid name", () => {
  assert.deepEqual(validateMuscleBody({ name: "Chest" }), {
    kind: "success",
    name: "Chest",
  });
});
