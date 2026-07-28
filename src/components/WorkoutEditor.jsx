import { useState } from "react";
import ExerciseModal from "./ExerciseModal";
import { createWorkoutExercise } from "../data/workout";

export default function WorkoutEditor({
  workoutDraft,
  onSaveWorkoutDraft,
  exercisesList,
  musclesList,
}) {
  const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const draftExercises = Object.values(workoutDraft.workoutExercises);
  const exercises = Object.values(exercisesList);

  let workoutForm;
  if (workoutDraft) {
    workoutForm = (
      <>
        <div>Name: {workoutDraft.name}</div>
        <div>Exercícios:</div>
        <div>
          <button
            onClick={() => {
              setExerciseModalOpen(true);
            }}
          >
            Adicionar Exercício
          </button>
          <ExerciseModal
            isOpen={isExerciseModalOpen}
            onClose={() => setExerciseModalOpen(false)}
            exercises={exercises}
            onSelect={handleAddExercise}
          ></ExerciseModal>

          {draftExercises.length === 0 ? (
            <div>Sem exercícios no workoutDraft</div>
          ) : (
            <ul>
              {draftExercises.map((draftExercise, index) => (
                <li key={draftExercise.id}>
                  <div>Exercício {draftExercise.name}</div>
                  <div>Muscles</div>
                  <div>Sets</div>
                  <button>Novo set</button>

                  <button
                    onClick={() => {
                      setExerciseIndex(index + 1);
                      setExerciseModalOpen(true);
                    }}
                  >
                    Adicionar Exercício {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  } else {
    workoutForm = <div>Sem workoutDraft</div>;
  }

  return <div>{workoutForm}</div>;

  function handleAddExercise(exerciseId) {
    onSaveWorkoutDraft((prev) => {
      const newMuscles = exercisesList[exerciseId].muscles.map((muscleId) => ({
        id: muscleId,
        name: musclesList[muscleId].name,
      }));
      const newExercise = createWorkoutExercise(
        exercisesList[exerciseId].name,
        exerciseId,
        newMuscles,
        [],
      );
      const newExercises = [
        ...prev.workoutExercises.slice(0, exerciseIndex),
        newExercise,
        ...prev.workoutExercises.slice(exerciseIndex),
      ];

      return { ...prev, workoutExercises: newExercises };
    });

    setExerciseModalOpen(false);
  }
}
