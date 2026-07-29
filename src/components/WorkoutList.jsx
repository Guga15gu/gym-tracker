import { createWorkout } from "../data/workout";

export default function WorkoutList({ workoutList, onNewWorkout }) {
  const workouts = Object.values(workoutList);

  return (
    <>
      <h1>Workouts</h1>

      <button onClick={handleNewWorkout}>Começar novo Workout</button>
      {workouts.length === 0 ? (
        <div>Sem workouts</div>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <button>
                {workout.name} in {workout.timestamp}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  function handleNewWorkout() {
    const todayDate = new Date().toISOString().split("T")[0];
    const name = `Workout ${todayDate}`;

    onNewWorkout(createWorkout(name, []));
  }
}
