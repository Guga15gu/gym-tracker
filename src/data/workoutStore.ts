import type { Workout } from "./workout";

export function getWorkouts(): Record<string, Workout> {
  const workouts = localStorage.getItem("workouts");
  if (workouts === null) {
    return {};
  }

  return JSON.parse(workouts) as Record<string, Workout>;
}

export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts();
  workouts[workout.id] = workout;

  localStorage.setItem("workouts", JSON.stringify(workouts));
}

export function getWorkoutDraft(): Workout | null {
  const workoutDraft = localStorage.getItem("workoutDraft");

  if (workoutDraft === null) return null;

  return JSON.parse(workoutDraft) as Workout;
}

export function saveWorkoutDraft(workoutDraft: Workout): void {
  localStorage.setItem("workoutDraft", JSON.stringify(workoutDraft));
}

export function clearWorkoutDraft(): void {
  localStorage.removeItem("workoutDraft");
}
