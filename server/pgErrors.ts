const ERRORS = { "23505": 409, "22P02": 400 };

export function pgErrorToStatus(err: unknown): number {
  if (
    err instanceof Error &&
    "code" in err &&
    typeof err.code === "string" &&
    Object.hasOwn(ERRORS, err.code)
  ) {
    return ERRORS[err.code as keyof typeof ERRORS];
  }
  console.error(err);
  return 500;
}
