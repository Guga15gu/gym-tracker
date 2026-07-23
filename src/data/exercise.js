export { createExercise };

/**
 * @typedef {Object} Exercise
 * @property {string} id - UUID
 * @property {string} name
 * @property {string[]} muscles - array of muscle ids
 */
/**
 * @param {string} name
 * @param {string[]} muscles - array of muscle ids
 * @returns {Exercise}
 * @throws {Error} if name is not string
 * @throws {Error} if muscles is not array
 * @throws {Error} if muscles is empty array
 * @throws {Error} if an element of muscle array is not a string
 */
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
