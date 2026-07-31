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
            {index !== 0 && (
              <button onClick={() => handleMove(index - 1, index)}>
                Mover para cima
              </button>
            )}
            <div>{exercise.name}</div>
            <div>
              Muscles:{" "}
              {exercise.muscles.map((muscle) => muscle.name).join(", ")}
            </div>
            <SetsArea
              sets={exercise.sets}
              onChangeSets={(newSets) => handleChangeSets(newSets, exercise.id)}
            ></SetsArea>

            {index !== exercises.length - 1 && (
              <button onClick={() => handleMove(index, index + 1)}>
                Mover para baixo
              </button>
            )}

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

  function handleMove(index, index2) {
    const leftExercises = exercises.slice(0, index);
    const rightExercises = exercises.slice(index2 + 1);

    onChangeExercises([
      ...leftExercises,
      exercises[index2],
      exercises[index],
      ...rightExercises,
    ]);
  }

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
