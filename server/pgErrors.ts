const ERRORS = {
  "23505": { status: 409, payload: { error: "Conflict: duplicated key" } },
  "22P02": { status: 400, payload: { error: "Bad Request" } },
};

type ErrorResponse = { status: number; payload: { error: string } };

export function pgErrorToResponse(err: unknown): ErrorResponse {
  if (
    err instanceof Error &&
    "code" in err &&
    typeof err.code === "string" &&
    Object.hasOwn(ERRORS, err.code)
  ) {
    return ERRORS[err.code as keyof typeof ERRORS];
  }
  return {
    status: 500,
    payload: { error: "Internal Server Error" },
  };
}
