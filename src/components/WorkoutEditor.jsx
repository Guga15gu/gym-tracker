import { useState } from "react";
import ExerciseModal from "./ExerciseModal";
import { createWorkoutExercise } from "../data/workout";
import SetsArea from "./SetsArea";

export default function WorkoutEditor({
  workoutDraft,
  onSaveDraft,
  exercisesList,
  musclesList,
  onFinalizeWorkout,
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
        <button onClick={handleFinalizeWorkout}>Finalizar workout</button>
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
                  <SetsArea
                    sets={draftExercise.sets}
                    onChangeSets={(newSets) =>
                      handleChangeSets(newSets, draftExercise.id)
                    }
                  ></SetsArea>

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

  function handleFinalizeWorkout() {
    onFinalizeWorkout(workoutDraft);
  }

  function handleChangeSets(newSets, workoutExerciseId) {
    onSaveDraft({
      ...workoutDraft,
      workoutExercises: workoutDraft.workoutExercises.map((workoutExercise) => {
        if (workoutExercise.id === workoutExerciseId) {
          return { ...workoutExercise, sets: newSets };
        } else {
          return workoutExercise;
        }
      }),
    });
  }

  function handleAddExercise(exerciseId) {
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
      ...workoutDraft.workoutExercises.slice(0, exerciseIndex),
      newExercise,
      ...workoutDraft.workoutExercises.slice(exerciseIndex),
    ];

    onSaveDraft({ ...workoutDraft, workoutExercises: newExercises });

    setExerciseModalOpen(false);
  }
}
