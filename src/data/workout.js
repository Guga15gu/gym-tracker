/**
 * @typedef {Object} WorkoutExercise
 * @property {string} id
 * @property {string} name
 * @property {string} exerciseId
 * @property {import("./muscle.js").Muscle[]} muscles
 * @property {import("./exerciseSet").ExerciseSet[]} sets
 */

/**
 * @param {string} name
 * @param {string} exerciseId - UUID
 * @param {import("./muscle.js").Muscle[]} muscles
 * @param {import("./exerciseSet").ExerciseSet[]} sets
 * @returns {WorkoutExercise}
 * @throws {Error} if name is not string
 * @throws {Error} if exerciseId is not string
 * @throws {Error} if muscles is not array
 * @throws {Error} if sets is not array
 */
export function createWorkoutExercise(name, exerciseId, muscles, sets) {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  if (typeof exerciseId !== "string") {
    throw new Error("exerciseId is not string");
  }
  if (!Array.isArray(muscles)) {
    throw new Error("muscles is not array");
  }
  if (!Array.isArray(sets)) {
    throw new Error("sets is not array");
  }

  return {
    id: crypto.randomUUID(),
    name: name,
    exerciseId: exerciseId,
    muscles: muscles,
    sets: sets,
  };
}

/**
 * @typedef {Object} Workout
 * @property {string} id
 * @property {string} name
 * @property {number} timestamp
 * @property {WorkoutExercise[]} workoutExercises
 */

/**
 * @param {string} name
 * @param {WorkoutExercise[]} workoutExercises
 * @returns {Workout}
 * @throws {Error} if name is not string
 * @throws {Error} if workoutExercises is not array
 */
export function createWorkout(name, workoutExercises) {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  if (!Array.isArray(workoutExercises)) {
    throw new Error("workoutExercises is not array");
  }

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    timestamp: Date.now(),
    workoutExercises: workoutExercises,
  };
}
