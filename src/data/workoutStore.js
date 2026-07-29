export function getWorkouts() {
  const workouts = localStorage.getItem("workouts");
  if (workouts === null) {
    return {};
  }

  return JSON.parse(workouts);
}

export function saveWorkout(workout) {
  const workouts = getWorkouts();
  workouts[workout.id] = workout;

  localStorage.setItem("workouts", JSON.stringify(workouts));
}

export function getWorkoutDraft() {
  const workoutDraft = localStorage.getItem("workoutDraft");

  if (workoutDraft === null) return null;

  return JSON.parse(workoutDraft);
}

export function saveWorkoutDraft(workoutDraft) {
  localStorage.setItem("workoutDraft", JSON.stringify(workoutDraft));
}
