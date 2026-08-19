type MuscleBodyValidation =
  | { kind: "success"; name: string }
  | { kind: "error"; status: number; payload: { error: string } };

export function validateMuscleBody(body: unknown | null): MuscleBodyValidation {
  if (
    !body ||
    typeof body !== "object" ||
    !("name" in body) ||
    typeof body.name !== "string"
  ) {
    return {
      kind: "error",
      status: 400,
      payload: { error: "name is not string" },
    };
  }
  const trimmedName = body.name.trim();
  if (trimmedName === "") {
    return {
      kind: "error",
      status: 422,
      payload: { error: "name is empty" },
    };
  }

  return { kind: "success", name: trimmedName };
}
