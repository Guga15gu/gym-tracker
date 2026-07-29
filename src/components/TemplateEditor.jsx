import { useState } from "react";
import { createTemplateExercise } from "../data/template";
import ExerciseModal from "./ExerciseModal";
import SetsArea from "./SetsArea";

export default function TemplateEditor({
  template,
  exercisesList,
  onUpdateTemplate,
}) {
  const [draft, setDraft] = useState(() => ({ ...template }));
  const [isOpenSelectExercise, setIsOpenSelectExercise] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);

  const exercises = Object.values(exercisesList);

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
        <div>
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
            exercises={exercises}
            onSelect={handleAddExercise}
          ></ExerciseModal>

          <ul>
            {draft.exercises.map((exercise, index) => (
              <li key={exercise.id}>
                <div>{exercisesList[exercise.exerciseId].name}</div>

                <SetsArea
                  sets={exercise.sets}
                  onChangeSets={(newSets) =>
                    handleChangeSets(newSets, exercise.id)
                  }
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
        </div>
      </>
    );
  } else {
    templateForm = <div>Template não selecionado</div>;
  }

  return (
    <>
      <div>Template Editor: {draft.name}</div>
      <button onClick={() => onUpdateTemplate(draft)}>Salvar Template</button>
      {templateForm}
    </>
  );

  function handleChangeSets(newSets, templateExerciseId) {
    setDraft((prev) => {
      return {
        ...prev,
        exercises: prev.exercises.map((exercise) => {
          if (exercise.id === templateExerciseId) {
            return { ...exercise, sets: newSets };
          } else {
            return exercise;
          }
        }),
      };
    });
  }

  function handleAddExercise(exerciseId) {
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
    setIsOpenSelectExercise(false);
  }
}
