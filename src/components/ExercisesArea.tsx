import { Fragment, useState } from "react";
import SetsArea from "./SetsArea";
import ExerciseModal from "./ExerciseModal";
import type { WorkoutExercise } from "../data/workout";
import type { Exercise } from "../data/exercise";
import type { ExerciseSet } from "../data/exerciseSet";
import type { ExerciseDirtyMap } from "../utils/generateExerciseDirtyMap";

type ModalAction =
  { kind: "add"; exerciseIndex: number } | { kind: "replace"; id: string };

type ExercisesAreaProps = {
  exercises: WorkoutExercise[];
  exercisesList: Record<string, Exercise>;
  exerciseDirtyMap?: ExerciseDirtyMap;
  onAddExercise: (exerciseId: string, exerciseIndex: number) => void;
  onChangeExercises: (exercises: WorkoutExercise[]) => void;
  onReplaceExercise: (entryId: string, newExerciseId: string) => void;
};
export default function ExercisesArea({
  exercises,
  exercisesList,
  exerciseDirtyMap,
  onAddExercise,
  onChangeExercises,
  onReplaceExercise,
}: ExercisesAreaProps) {
  const [modalAction, setModalAction] = useState<ModalAction | null>(null);

  return (
    <div className="exercise-area">
      <button
        onClick={() => {
          setModalAction({ kind: "add", exerciseIndex: 0 });
        }}
      >
        Adicionar Exercício
      </button>

      <ExerciseModal
        isOpen={modalAction !== null}
        onClose={() => setModalAction(null)}
        exercisesList={exercisesList}
        onSelect={(exerciseId) => {
          if (modalAction?.kind === "add") {
            onAddExercise(exerciseId, modalAction.exerciseIndex);
          } else if (modalAction?.kind === "replace") {
            onReplaceExercise(modalAction.id, exerciseId);
          }

          setModalAction(null);
        }}
      ></ExerciseModal>

      <ul className="exercise-list">
        {exercises.map((exercise, index) => {
          let exerciseClass = "";
          if (exerciseDirtyMap?.[exercise.id]?.added) {
            exerciseClass = "newExercise";
          } else if (exerciseDirtyMap?.[exercise.id]?.replaced) {
            exerciseClass = "replacedExercise";
          }

          return (
            <Fragment key={exercise.id}>
              <li className="exercise-item">
                <div className="exercise-description">
                  <h3 className={exerciseClass}>{exercise.name}</h3>
                  <div className="muscles-item">
                    {exercise.muscles.map((muscle) => muscle.name).join(", ")}
                  </div>
                </div>

                <SetsArea
                  sets={exercise.sets}
                  setDirtyMap={exerciseDirtyMap?.[exercise.id]?.setDirtyMap}
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
                  <div className="exercise-change">
                    <button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="exercise-delete"
                    >
                      Deletar exercício
                    </button>
                    <button
                      onClick={() => handleReplaceExercise(exercise.id)}
                      className="exercise-replace"
                    >
                      Substituir Exercício
                    </button>
                  </div>
                </div>
              </li>
              <li className="exercise-add">
                <button
                  onClick={() => {
                    setModalAction({ kind: "add", exerciseIndex: index + 1 });
                  }}
                >
                  Adicionar Exercício {index + 1}
                </button>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );

  function handleReplaceExercise(exerciseId: string) {
    setModalAction({ kind: "replace", id: exerciseId });
  }

  function handleDeleteExercise(exerciseId: string) {
    onChangeExercises(
      exercises.filter((exercise) => exercise.id !== exerciseId),
    );
  }

  function handleMove(index: number, index2: number) {
    const leftExercises = exercises.slice(0, index);
    const rightExercises = exercises.slice(index2 + 1);

    onChangeExercises([
      ...leftExercises,
      exercises[index2],
      exercises[index],
      ...rightExercises,
    ]);
  }

  function handleChangeSets(newSets: ExerciseSet[], exerciseId: string) {
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
