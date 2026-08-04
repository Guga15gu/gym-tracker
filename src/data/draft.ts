import type { WorkoutExercise } from "./workout";

export type Draft = {
  id: string;
  name: string;
  startedAt: number;
  workoutExercises: WorkoutExercise[];
};

/**
 * @throws {Error} if name is not string
 * @throws {Error} if workoutExercises is not array
 */
export function createDraft(
  name: string,
  workoutExercises: WorkoutExercise[],
): Draft {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  if (!Array.isArray(workoutExercises)) {
    throw new Error("workoutExercises is not array");
  }

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    startedAt: Date.now(),
    workoutExercises: workoutExercises,
  };
}
