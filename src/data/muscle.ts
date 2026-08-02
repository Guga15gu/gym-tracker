export type Muscle = { id: string; name: string };
/**
 * @throws {Error} if name is not string
 * @throws {Error} if name is empty or whitespace-only
 */
export function createMuscle(name: string): Muscle {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  const trimmedName = name.trim();

  if (trimmedName === "") {
    throw new Error("Name is empty");
  }

  return { id: crypto.randomUUID(), name: trimmedName };
}
