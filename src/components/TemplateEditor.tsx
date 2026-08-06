import { useState } from "react";
import {
  createTemplateExercise,
  type TemplateExercise,
  type Template,
} from "../data/template";
import ExercisesArea from "./ExercisesArea";
import type { Exercise } from "../data/exercise";
import type { Muscle } from "../data/muscle";
import { generateExerciseDirtyMap } from "../utils/generateExerciseDirtyMap";

type TemplateEditorProps = {
  template: Template;
  exercisesList: Record<string, Exercise>;
  musclesList: Record<string, Muscle>;
  onUpdateTemplate: (template: Template) => void;
};
export default function TemplateEditor({
  template,
  exercisesList,
  musclesList,
  onUpdateTemplate,
}: TemplateEditorProps) {
  const [draft, setDraft] = useState(() => ({ ...template }));

  let templateForm;
  if (template) {
    templateForm = (
      <>
        <div>
          <input
            value={draft.name}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, name: e.target.value }))
            }
          ></input>
        </div>

        <div>Exercicios:</div>
        <ExercisesArea
          exercises={draft.exercises.map((exercise) => {
            const muscles = exercisesList[exercise.exerciseId].muscles.map(
              (muscleId) => musclesList[muscleId],
            );
            return {
              ...exercise,
              name: exercisesList[exercise.exerciseId].name,
              muscles: muscles,
            };
          })}
          exercisesList={exercisesList}
          exerciseDirtyMap={generateExerciseDirtyMap(
            template.exercises,
            draft.exercises,
          )}
          onAddExercise={handleAddExercise}
          onChangeExercises={handleChangeExercises}
        ></ExercisesArea>
      </>
    );
  } else {
    templateForm = <div>Template não selecionado</div>;
  }

  return (
    <>
      <h2>Template Editor: {draft.name}</h2>
      <button onClick={() => onUpdateTemplate(draft)}>Salvar Template</button>
      {templateForm}
    </>
  );

  function handleChangeExercises(newExercises: TemplateExercise[]) {
    setDraft((prev) => {
      return {
        ...prev,
        exercises: newExercises.map(({ id, exerciseId, sets }) => ({
          id,
          exerciseId,
          sets,
        })),
      };
    });
  }

  function handleAddExercise(exerciseId: string, exerciseIndex: number) {
    setDraft((prev) => {
      const beginArray = prev.exercises.slice(0, exerciseIndex);
      const endArray = prev.exercises.slice(
        exerciseIndex,
        prev.exercises.length,
      );
      const newTemplateExercise = createTemplateExercise(exerciseId, []);
      return {
        ...prev,
        exercises: [...beginArray, newTemplateExercise, ...endArray],
      };
    });
  }
}
