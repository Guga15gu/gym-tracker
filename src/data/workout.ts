import type { ExerciseSet } from "./exerciseSet";
import type { Muscle } from "./muscle";

export type Workout = {
  id: string;
  name: string;
  timestamp: number;
  workoutExercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  id: string;
  name: string;
  exerciseId: string;
  muscles: Muscle[];
  sets: ExerciseSet[];
};

/**
 * @throws {Error} if name is not string
 * @throws {Error} if exerciseId is not string
 * @throws {Error} if muscles is not array
 * @throws {Error} if sets is not array
 */
export function createWorkoutExercise(
  name: string,
  exerciseId: string,
  muscles: Muscle[],
  sets: ExerciseSet[],
): WorkoutExercise {
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
 * @throws {Error} if name is not string
 * @throws {Error} if workoutExercises is not array
 */
export function createWorkout(
  name: string,
  workoutExercises: WorkoutExercise[],
): Workout {
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
