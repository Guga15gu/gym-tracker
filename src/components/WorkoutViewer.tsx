import type { Workout } from "../data/workout";

type WorkoutViewerProps = {
  workout: Workout;
  onBack: () => void;
};
export default function WorkoutViewer({ workout, onBack }: WorkoutViewerProps) {
  const startedAt = new Date(workout.startedAt);

  return (
    <>
      <h2>Workout Viewer</h2>
      <button onClick={onBack}>Voltar para histórico</button>
      <h3>{workout.name}</h3>

      <div>{startedAt.toLocaleString("pt-BR")}</div>

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
