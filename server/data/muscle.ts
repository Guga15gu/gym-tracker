type MuscleBodyValidation =
  | { kind: "success"; name: string }
  | { kind: "error"; status: number; message: string };

export function validateMuscleBody(body: unknown | null): MuscleBodyValidation {
  if (
    !body ||
    typeof body !== "object" ||
    !("name" in body) ||
    typeof body.name !== "string"
  ) {
    return { kind: "error", status: 400, message: "name is not string" };
  }
  if (body.name.trim() === "") {
    return { kind: "error", status: 422, message: "name is empty" };
  }

  return { kind: "success", name: body.name };
}
