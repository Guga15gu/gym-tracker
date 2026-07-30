export default function WorkoutList({
  workoutList,
  hasDraft,
  onStartWorkout,
  onSelectWorkout,
}) {
  const workouts = Object.values(workoutList);

  return (
    <>
      <h1>Workouts List</h1>

      <button onClick={onStartWorkout}>
        {hasDraft ? "Retomar workout" : "Começar novo Workout"}
      </button>
      {workouts.length === 0 ? (
        <div>Sem workouts</div>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <button onClick={() => onSelectWorkout(workout.id)}>
                {workout.name} in {workout.timestamp}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
