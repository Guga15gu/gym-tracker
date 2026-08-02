import { Fragment, useState } from "react";
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
    <div className="exercise-area">
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

      <ul className="exercise-list">
        {exercises.map((exercise, index) => (
          <Fragment key={exercise.id}>
            <li className="exercise-item">
              <div className="exercise-description">
                <h3>{exercise.name}</h3>
                <div className="muscles-item">
                  {exercise.muscles.map((muscle) => muscle.name).join(", ")}
                </div>
              </div>

              <SetsArea
                sets={exercise.sets}
                onChangeSets={(newSets) =>
                  handleChangeSets(newSets, exercise.id)
                }
              ></SetsArea>

              <div className="exercise-actions">
                <div className="exercise-reorder">
                  {index !== 0 && (
                    <button onClick={() => handleMove(index - 1, index)}>
                      Mover para cima
                    </button>
                  )}
                  {index !== exercises.length - 1 && (
                    <button onClick={() => handleMove(index, index + 1)}>
                      Mover para baixo
                    </button>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="exercise-delete"
                  >
                    Deletar exercício
                  </button>
                </div>
              </div>
            </li>
            <li className="exercise-add">
              <button
                onClick={() => {
                  setExerciseIndex(index + 1);
                  setIsOpenSelectExercise(true);
                }}
              >
                Adicionar Exercício {index + 1}
              </button>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );

  function handleDeleteExercise(exerciseId) {
    onChangeExercises(
      exercises.filter((exercise) => exercise.id !== exerciseId),
    );
  }

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
