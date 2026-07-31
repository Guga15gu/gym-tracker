import { useState } from "react";
import SetsArea from "./SetsArea";
import ExerciseModal from "./ExerciseModal";

export default function ExercisesArea({
  exercises,
  exercisesList,
  onAddExercise,
  onChangeExercises,
}) {
  const [isOpenSelectExercise, setIsOpenSelectExercise] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);

  return (
    <>
      <button
        onClick={() => {
          setIsOpenSelectExercise(true);
          setExerciseIndex(0);
        }}
      >
        Adicionar Exercício
      </button>

      <ExerciseModal
        isOpen={isOpenSelectExercise}
        onClose={() => setIsOpenSelectExercise(false)}
        exercisesList={exercisesList}
        onSelect={(exerciseId) => {
          onAddExercise(exerciseId, exerciseIndex);
          setIsOpenSelectExercise(false);
        }}
      ></ExerciseModal>

      <ul>
        {exercises.map((exercise, index) => (
          <li key={exercise.id}>
            <div>{exercise.name}</div>
            <div>
              Muscles:{" "}
              {exercise.muscles.map((muscle) => muscle.name).join(", ")}
            </div>
            <SetsArea
              sets={exercise.sets}
              onChangeSets={(newSets) => handleChangeSets(newSets, exercise.id)}
            ></SetsArea>
            <button
              onClick={() => {
                setExerciseIndex(index + 1);
                setIsOpenSelectExercise(true);
              }}
            >
              Adicionar Exercício {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  function handleChangeSets(newSets, exerciseId) {
    const newExercises = exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return { ...exercise, sets: newSets };
      } else {
        return exercise;
      }
    });

    onChangeExercises(newExercises);
  }
}
