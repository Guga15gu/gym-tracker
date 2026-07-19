export function createMuscle(name) {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  const trimmedName = name.trim();

  if (trimmedName === "") {
    throw new Error("Name is empty");
  }

  return { id: crypto.randomUUID(), name: trimmedName };
}
