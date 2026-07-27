import { useState } from "react";
import { createExerciseSet } from "../data/exerciseSet";
import { createTemplateExercise } from "../data/template";

function SetsArea({ exerciseId, sets, setDraft }) {
  const [newReps, setNewReps] = useState("0");
  const [newWeight, setNewWeight] = useState("0");

  const newRepsNum = Number(newReps);
  const newWeightNum = Number(newWeight);

  const disableAddSet =
    !(Number.isFinite(newRepsNum) && Number.isFinite(newWeightNum)) ||
    newRepsNum < 0 ||
    newWeightNum < 0 ||
    newReps === "" ||
    newWeight === "";

  return (
    <div>
      <div>Sets:</div>
      <ul>
        {sets.map((set, index) => (
          <li key={index}>
            {set.reps} reps {set.weight} kg
          </li>
        ))}
      </ul>
      <input
        type="number"
        value={newReps}
        onChange={(e) => setNewReps(e.target.value)}
        style={{ width: "4em" }}
      />
      Reps
      <input
        type="number"
        value={newWeight}
        onChange={(e) => setNewWeight(e.target.value)}
        style={{ width: "4em" }}
      />
      kg
      <button onClick={handleAddSet} disabled={disableAddSet}>
        Adicionar set
      </button>
    </div>
  );

  function handleAddSet() {
    setDraft((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.exerciseId === exerciseId) {
          const newSet = createExerciseSet(newRepsNum, newWeightNum);

          const newSets = [...exercise.sets, newSet];
          return { ...exercise, sets: newSets };
        } else {
          return exercise;
        }
      }),
    }));
  }
}

export default function TemplateEditor({
  template,
  exercisesList,
  onUpdateTemplate,
}) {
  const [draft, setDraft] = useState(() => ({ ...template }));
  const [isOpenSelectExercise, setIsOpenSelectExercise] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);

  const exercises = Object.values(exercisesList);

  let exerciseModal = (
    <div>
      <dialog open={isOpenSelectExercise}>
        <button onClick={() => setIsOpenSelectExercise(false)}>fechar</button>

        <div>Seleção de Exercise</div>
        <ul style={{ overflowY: "auto", maxHeight: "100px" }}>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <button
                onClick={() => handleAddExercise(exerciseIndex, exercise.id)}
              >
                {exercise.name}
              </button>
            </li>
          ))}
        </ul>
      </dialog>
    </div>
  );

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

          {exerciseModal}

          <ul>
            {draft.exercises.map((exercise, index) => (
              <li key={exercise.id}>
                <div>{exercisesList[exercise.exerciseId].name}</div>

                <SetsArea
                  exerciseId={exercise.exerciseId}
                  sets={exercise.sets}
                  setDraft={setDraft}
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

  function handleAddExercise(position, exerciseId) {
    setDraft((prev) => {
      const beginArray = prev.exercises.slice(0, position);
      const endArray = prev.exercises.slice(position, prev.exercises.length);
      const newTemplateExercise = createTemplateExercise(exerciseId, []);
      return {
        ...prev,
        exercises: [...beginArray, newTemplateExercise, ...endArray],
      };
    });
    setIsOpenSelectExercise(false);
  }
}
