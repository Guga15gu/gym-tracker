import { createExerciseSet } from "./exerciseSet.js";

/**
 * @typedef {Object} TemplateExercise
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
 * @param {string} name
 * @param {TemplateExercise[]} exercises
 * @returns {Template}
 * @throws {Error} if name is not string or empty
 * @throws {Error} if exercises is not a array
 * @throws {Error} if a exerciseId is not a string
 * @throws {Error} if a set is invalid (createExerciseSet)
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
    throw new Error("Exercises is not array");
  }

  const exercisesArray = [];
  for (const [indexExercise, exercise] of exercises.entries()) {
    if (typeof exercise.exerciseId !== "string") {
      throw new Error(`ExerciseId[${indexExercise}] is not string`);
    }

    const setsArray = [];
    for (const [setIndex, set] of exercise.sets.entries()) {
      try {
        setsArray.push(createExerciseSet(set.reps, set.weight));
      } catch (error) {
        throw new Error(
          `Set[${setIndex}] of exercise[${indexExercise}]: ${error.message}`,
          { cause: error },
        );
      }
    }

    exercisesArray.push({ exerciseId: exercise.exerciseId, sets: setsArray });
  }

  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    exercises: exercisesArray,
  };
}
