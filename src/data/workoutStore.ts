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
