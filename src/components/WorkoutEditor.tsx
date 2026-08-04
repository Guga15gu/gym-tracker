import { useState } from "react";
import { createWorkoutExercise, type WorkoutExercise } from "../data/workout";
import { createExerciseSet } from "../data/exerciseSet";
import ExercisesArea from "./ExercisesArea";
import type { Exercise } from "../data/exercise";
import type { Muscle } from "../data/muscle";
import type { Template } from "../data/template";
import type { Draft } from "../data/draft";

type WorkoutEditorProps = {
  draft: Draft;
  exercisesList: Record<string, Exercise>;
  musclesList: Record<string, Muscle>;
  templatesList: Record<string, Template>;
  onSaveDraft: (draft: Draft) => void;
  onFinalizeWorkout: () => void;
  onDiscardDraft: () => void;
  onBack: () => void;
};
export default function WorkoutEditor({
  draft,
  exercisesList,
  musclesList,
  templatesList,
  onSaveDraft,
  onFinalizeWorkout,
  onDiscardDraft,
  onBack,
}: WorkoutEditorProps) {
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const draftExercises = draft.workoutExercises;
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
          value={draft.name}
          onChange={(e) => onSaveDraft({ ...draft, name: e.target.value })}
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

  function handleSelectTemplate(templateId: string) {
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

    onSaveDraft({ ...draft, workoutExercises: draftExercises });
  }

  function handleDiscard() {
    onDiscardDraft();
  }

  function handleChangeExercises(newExercises: WorkoutExercise[]) {
    onSaveDraft({
      ...draft,
      workoutExercises: newExercises,
    });
  }

  function handleAddExercise(exerciseId: string, exerciseIndex: number) {
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
      ...draft.workoutExercises.slice(0, exerciseIndex),
      newExercise,
      ...draft.workoutExercises.slice(exerciseIndex),
    ];

    onSaveDraft({ ...draft, workoutExercises: newExercises });
  }
}
