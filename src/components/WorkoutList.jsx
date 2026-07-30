export default function WorkoutList({
  workoutList,
  hasDraft,
  selectedWorkoutId,
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

      {selectedWorkoutId && (
        <div>
          <span>Último visto: </span>
          <button onClick={() => onSelectWorkout(selectedWorkoutId)}>
            {workoutList[selectedWorkoutId].name} in
            {workoutList[selectedWorkoutId].timestamp}
          </button>
        </div>
      )}

      {workouts.length === 0 ? (
        <div>Sem workouts</div>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <button onClick={() => onSelectWorkout(workout.id)}>
                {workout.name} in {workout.timestamp}
              </button>
              {selectedWorkoutId === workout.id && <span> (Último visto)</span>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
