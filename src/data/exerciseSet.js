/**
 * @typedef {Object} ExerciseSet
 * @property {number} reps
 * @property {number} weight
 */
/**
 * @param {number} reps
 * @param {number} weight
 * @returns {ExerciseSet}
 * @throws {Error} if reps is not a non-negative finite number
 * @throws {Error} if weight is not a non-negative finite number

 */
export function createExerciseSet(reps, weight) {
  if (!Number.isFinite(reps)) {
    throw new Error("Reps is not a finite number");
  }
  if (reps < 0) {
    throw new Error("Reps is negative");
  }

  if (!Number.isFinite(weight)) {
    throw new Error("Weight is not a finite number");
  }
  if (weight < 0) {
    throw new Error("Weight is negative");
  }

  return { reps, weight };
}
