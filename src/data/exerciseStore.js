export { getExercises, addExercise };

function getExercises() {
  const exercises = localStorage.getItem("exercises");
  if (exercises === null) {
    return {};
  }

  return JSON.parse(exercises);
}
function addExercise(exercise) {
  const exercises = getExercises();
  exercises[exercise.id] = exercise;

  localStorage.setItem("exercises", JSON.stringify(exercises));
}
