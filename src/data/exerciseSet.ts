export type ExerciseSet = { id: string; reps: number; weight: number };

export function isValidSetValue(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

/**
 * @throws {Error} if reps is not a non-negative finite number
 * @throws {Error} if weight is not a non-negative finite number
 */
export function createExerciseSet(reps: number, weight: number): ExerciseSet {
  if (!isValidSetValue(reps)) {
    throw new Error("reps is not a non-negative finite number");
  }
  if (!isValidSetValue(weight)) {
    throw new Error("weight is not a non-negative finite number");
  }

  return { id: crypto.randomUUID(), reps, weight };
}
