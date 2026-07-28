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
