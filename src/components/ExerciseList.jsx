import { useState } from "react";
import { getExercises } from "../data/exerciseStore";
import { getMuscles } from "../data/muscleStore";

export default function ExerciseList() {
  const [exercisesList, setExercisesList] = useState(getExercises());
  const [musclesList, setMusclesList] = useState(getMuscles());
  const [showMuscles, setShowMuscles] = useState(false);

  const exercises = Object.values(exercisesList);

  const exercisesToUi = exercises.map((exercise) => {
    const muscleNames = exercise.muscles.map((muscleId) => {
      return musclesList[muscleId].name;
    });

    return { id: exercise.id, name: exercise.name, muscles: muscleNames };
  });

  let listContent;
  if (exercises.length === 0) {
    listContent = <div>Sem exercícios cadastrados</div>;
  } else {
    listContent = (
      <ul>
        {exercisesToUi.map((exercise) => (
          <li key={exercise.id}>
            <div>
              <strong>{exercise.name}</strong>
            </div>
            {showMuscles && <div>{exercise.muscles.join(", ")}</div>}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div>Lista de Exercícios</div>
      <button onClick={handleShowMuscles}>
        {showMuscles ? "Esconder músculos" : "Mostrar músculos"}
      </button>
      {listContent}
    </>
  );

  function handleShowMuscles() {
    setShowMuscles((show) => !show);
  }
}
