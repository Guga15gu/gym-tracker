import "./App.css";

import { useState } from "react";

import { getMuscles, addMuscle } from "./data/muscleStore";
import { getExercises, addExercise } from "./data/exerciseStore";
import { createMuscle } from "./data/muscle";
import { createExercise } from "./data/exercise";

import MuscleList from "./components/MuscleList";
import ExerciseList from "./components/ExerciseList";

function App() {
  const [exercisesList, setExercisesList] = useState(getExercises());
  const [musclesList, setMusclesList] = useState(getMuscles());

  return (
    <>
      <MuscleList
        musclesList={musclesList}
        onAddMuscle={handleAddMuscle}
      ></MuscleList>
      <ExerciseList
        exercisesList={exercisesList}
        musclesList={musclesList}
        onAddExercise={handleAddExercise}
      ></ExerciseList>
    </>
  );

  function handleAddExercise(exerciseName, selectedMuscles) {
    const newExercise = createExercise(exerciseName, [...selectedMuscles]);

    addExercise(newExercise);
    setExercisesList((prev) => ({ ...prev, [newExercise.id]: newExercise }));
  }

  function handleAddMuscle(muscleName) {
    const newMuscle = createMuscle(muscleName);

    addMuscle(newMuscle);
    setMusclesList((prev) => ({ ...prev, [newMuscle.id]: newMuscle }));
  }
}

export default App;
