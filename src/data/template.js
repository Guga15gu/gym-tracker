/**
 * @typedef {Object} TemplateExercise
 * @property {string} id - UUID
 * @property {string} exerciseId - UUID
 * @property {import("./exerciseSet.js").ExerciseSet[]} sets
 */
/**
 * @typedef {Object} Template
 * @property {string} id - UUID
 * @property {string} name - trimmed name
 * @property {TemplateExercise[]} exercises
 */

/**
 * @param {string} exerciseId
 * @param {import("./exerciseSet.js").ExerciseSet[]} sets
 * @returns {TemplateExercise}
 * @throws {Error} if exerciseId is not string
 * @throws {Error} if sets is not array
 */
export function createTemplateExercise(exerciseId, sets) {
  if (typeof exerciseId !== "string") {
    throw new Error("exerciseId is not string");
  }

  if (!Array.isArray(sets)) {
    throw new Error("sets is not array");
  }

  return { id: crypto.randomUUID(), exerciseId: exerciseId, sets: sets };
}

/**
 * @param {string} name
 * @param {TemplateExercise[]} exercises
 * @returns {Template}
 * @throws {Error} if name is not string or empty
 * @throws {Error} if exercises is not a array
 */
export function createTemplate(name, exercises) {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  const trimmedName = name.trim();
  if (trimmedName === "") {
    throw new Error("Name is empty");
  }

  if (!Array.isArray(exercises)) {
    throw new Error("exercises is not array");
  }

  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    exercises: exercises,
  };
}
