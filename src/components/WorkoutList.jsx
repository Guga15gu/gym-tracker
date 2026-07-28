import { useState } from "react";
import { getWorkouts } from "../data/workoutStore";
import { createWorkout } from "../data/workout";

export default function WorkoutList({ setWorkoutDraft }) {
  const [workoutList, setWorkoutList] = useState(() => getWorkouts());

  const workouts = Object.values(workoutList);

  return (
    <>
      <h1>Workouts</h1>
      <button onClick={handleAddWorkout}>Registrar novo workout</button>

      {workouts.length === 0 ? (
        <div>Sem workouts</div>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li>
              <button>
                {workout.name} in {workout.timestamp}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  function handleAddWorkout() {
    const todayDate = new Date().toISOString().split("T")[0];
    const name = `Workout ${todayDate}`;

    setWorkoutDraft(createWorkout(name, []));
  }
}
