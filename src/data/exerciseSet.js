export function createExerciseSet(reps, weight) {
  if (!Number.isFinite(reps)) {
    throw new Error("Reps is not a finite number");
  }
  if (reps <= 0) {
    throw new Error("Reps is negative or zero");
  }

  if (!Number.isFinite(weight)) {
    throw new Error("Weight is not a finite number");
  }
  if (weight < 0) {
    throw new Error("Weight is negative");
  }

  return { reps, weight };
}
