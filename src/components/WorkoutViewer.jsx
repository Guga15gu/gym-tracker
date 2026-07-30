export default function WorkoutViewer({ workout, onBack }) {
  return (
    <>
      <h1>Workout Viewer</h1>
      <button onClick={onBack}>Voltar para histórico</button>
      <h2>
        {workout.name} - {workout.timestamp}
      </h2>
      <ul>
        {workout.workoutExercises.map((workoutExercise) => (
          <li key={workoutExercise.id}>
            <h3>{workoutExercise.name}</h3>
            <div>
              {workoutExercise.muscles.map((muscle) => muscle.name).join(", ")}
            </div>
            <ul>
              {workoutExercise.sets.map((set, index) => (
                <li key={index}>
                  {set.reps} reps {set.weight} kg
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
