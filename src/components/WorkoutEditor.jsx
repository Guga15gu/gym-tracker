import { useState } from "react";
import { createWorkoutExercise } from "../data/workout";
import { createExerciseSet } from "../data/exerciseSet";
import ExercisesArea from "./ExercisesArea";

export default function WorkoutEditor({
  workoutDraft,
  exercisesList,
  musclesList,
  templatesList,
  onSaveDraft,
  onFinalizeWorkout,
  onDiscardDraft,
  onBack,
}) {
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const draftExercises = workoutDraft.workoutExercises;
  const templates = Object.values(templatesList);

  return (
    <>
      <dialog open={showTemplateModal}>
        <button onClick={() => setShowTemplateModal(false)}>fechar</button>
        <div>Seleção de Template</div>
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <button onClick={() => handleSelectTemplate(template.id)}>
                {template.name}
              </button>
            </li>
          ))}
        </ul>
      </dialog>

      <dialog open={showDiscardConfirmation}>
        <button onClick={() => setShowDiscardConfirmation(false)}>
          fechar
        </button>
        <button onClick={handleDiscard}>
          Confirmar descarte do workout atual
        </button>
      </dialog>

      <div className="workout-header">
        <input
          className="workout-name"
          value={workoutDraft.name}
          onChange={(e) =>
            onSaveDraft({ ...workoutDraft, name: e.target.value })
          }
        ></input>
        <button onClick={onBack} className="workout-back">
          Ver histórico
        </button>
      </div>

      <div className="workout-lifecycle">
        <button onClick={onFinalizeWorkout}>Finalizar workout</button>
        <button
          onClick={() => setShowDiscardConfirmation(true)}
          className="workout-delete"
        >
          Descartar workout
        </button>
      </div>

      <div className="workout-exercises">
        <div>Exercícios:</div>
        <button onClick={() => setShowTemplateModal(true)}>
          Substituir tudo por Template
        </button>

        <ExercisesArea
          exercises={draftExercises}
          exercisesList={exercisesList}
          onAddExercise={handleAddExercise}
          onChangeExercises={handleChangeExercises}
        ></ExercisesArea>
      </div>
    </>
  );

  function handleSelectTemplate(templateId) {
    setShowTemplateModal(false);

    const template = templatesList[templateId];

    const draftExercises = template.exercises.map((templateExercise) => {
      const exercise = exercisesList[templateExercise.exerciseId];
      const muscles = exercise.muscles.map((muscleId) => ({
        id: muscleId,
        name: musclesList[muscleId].name,
      }));
      const sets = templateExercise.sets.map((set) =>
        createExerciseSet(set.reps, set.weight),
      );

      return createWorkoutExercise(exercise.name, exercise.id, muscles, sets);
    });

    onSaveDraft({ ...workoutDraft, workoutExercises: draftExercises });
  }

  function handleDiscard() {
    onDiscardDraft();
  }

  function handleChangeExercises(newExercises) {
    onSaveDraft({
      ...workoutDraft,
      workoutExercises: newExercises,
    });
  }

  function handleAddExercise(exerciseId, exerciseIndex) {
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
  }
}
