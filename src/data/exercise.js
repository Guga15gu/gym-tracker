export { createExercise };

function createExercise(name, muscles) {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  if (!Array.isArray(muscles)) {
    throw new Error("Muscles is not array");
  }
  if (muscles.length === 0) {
    throw new Error("Muscles is an empty array");
  }

  for (const muscle of muscles) {
    if (typeof muscle !== "string") {
      throw new Error(`Muscle id ${muscle} is not a string`);
    }
  }

  return { id: crypto.randomUUID(), name, muscles };
}
