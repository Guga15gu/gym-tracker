export function createMuscle(name) {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  if (name === "") {
    throw new Error("Name is empty");
  }

  return { id: crypto.randomUUID(), name };
}
