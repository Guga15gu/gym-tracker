import type { Exercise } from "./exercise";

export function getExercises(): Record<string, Exercise> {
  const exercises = localStorage.getItem("exercises");
  if (exercises === null) {
    return {};
  }

  return JSON.parse(exercises) as Record<string, Exercise>;
}
export function addExercise(exercise: Exercise): void {
  const exercises = getExercises();
  exercises[exercise.id] = exercise;

  localStorage.setItem("exercises", JSON.stringify(exercises));
}

export function deleteExercise(exerciseId: string): void {
  const { [exerciseId]: deleted, ...rest } = getExercises();
  localStorage.setItem("exercises", JSON.stringify(rest));
}
