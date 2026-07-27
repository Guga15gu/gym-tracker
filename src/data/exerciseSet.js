/**
 * @typedef {Object} ExerciseSet
 * @property {number} reps
 * @property {number} weight
 */

export function isValidSetValue(value) {
  return Number.isFinite(value) && value >= 0;
}

/**
 * @param {number} reps
 * @param {number} weight
 * @returns {ExerciseSet}
 * @throws {Error} if reps is not a non-negative finite number
 * @throws {Error} if weight is not a non-negative finite number

 */
export function createExerciseSet(reps, weight) {
  if (!isValidSetValue(reps)) {
    throw new Error("reps is not a non-negative finite number");
  }
  if (!isValidSetValue(weight)) {
    throw new Error("weight is not a non-negative finite number");
  }

  return { reps, weight };
}
