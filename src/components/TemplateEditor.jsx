import { useState } from "react";
import { createTemplateExercise } from "../data/template";
import ExercisesArea from "./ExercisesArea";

export default function TemplateEditor({
  template,
  exercisesList,
  musclesList,
  onUpdateTemplate,
}) {
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

  function handleChangeExercises(newExercises) {
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

  function handleAddExercise(exerciseId, exerciseIndex) {
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
