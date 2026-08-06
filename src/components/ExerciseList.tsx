import { useState, type SubmitEvent } from "react";
import type { Exercise } from "../data/exercise";
import type { Muscle } from "../data/muscle";

type ExerciseListProps = {
  exercisesList: Record<string, Exercise>;
  musclesList: Record<string, Muscle>;
  usedExerciseIds: Set<string>;
  onAddExercise: (name: string, selectedMuscles: Set<string>) => void;
  onDeleteExercise: (exerciseId: string) => void;
};
export default function ExerciseList({
  exercisesList,
  musclesList,
  usedExerciseIds,
  onAddExercise,
  onDeleteExercise,
}: ExerciseListProps) {
  const [showMuscles, setShowMuscles] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(
    new Set(),
  );
  const [showMuscleSelect, setShowMuscleSelect] = useState(false);

  const exercises = Object.values(exercisesList);
  const muscles = Object.values(musclesList);

  const validSelectedMuscles = new Set(
    [...selectedMuscles].filter((muscle) => muscle in musclesList),
  );

  const selectedNameMuscles = Array.from(validSelectedMuscles).map(
    (muscleId) => musclesList[muscleId].name,
  );

  const trimmedExerciseName = exerciseName.trim();

  const filteredExercises = exercises.filter((exercise) => {
    if (trimmedExerciseName === "") {
      return true;
    }
    return exercise.name
      .toLowerCase()
      .includes(trimmedExerciseName.toLowerCase());
  });

  const exercisesToUi = filteredExercises.map((exercise) => {
    const muscleNames = exercise.muscles.map((muscleId) => {
      return musclesList[muscleId].name;
    });

    return { id: exercise.id, name: exercise.name, muscles: muscleNames };
  });

  let listContent;
  if (exercises.length === 0) {
    listContent = <div>Sem exercícios cadastrados</div>;
  } else if (filteredExercises.length === 0) {
    listContent = <div>Exercício não encontrado</div>;
  } else {
    listContent = (
      <>
        {exercises.length !== filteredExercises.length ? (
          <div>Buscando:</div>
        ) : (
          <div>Todos exercícios:</div>
        )}
        <ul>
          {exercisesToUi.map((exercise) => (
            <li key={exercise.id}>
              <div>
                <strong>{exercise.name} </strong>
                <button
                  onClick={() => onDeleteExercise(exercise.id)}
                  disabled={usedExerciseIds.has(exercise.id)}
                >
                  Delete
                </button>
              </div>

              {showMuscles && <div>{exercise.muscles.join(", ")}</div>}
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <h2>Lista de Exercícios</h2>

      <button onClick={handleShowMuscles}>
        {showMuscles ? "Esconder músculos" : "Mostrar músculos"}
      </button>

      <form onSubmit={handleAddExercise}>
        <input
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
        <button
          type="submit"
          disabled={
            trimmedExerciseName === "" || validSelectedMuscles.size === 0
          }
        >
          Adicionar {exerciseName}{" "}
        </button>
      </form>

      <div>
        {selectedNameMuscles.length === 0
          ? "Selecione pelo menos um músculo"
          : `Selecionados: ${selectedNameMuscles.join(", ")}`}
      </div>
      <button onClick={handleShowMuslesList}>Escolher músculos</button>

      {showMuscleSelect && (
        <div>
          <div>Seleção de Músculos:</div>
          <ul style={{ overflowY: "auto", maxHeight: "100px" }}>
            {muscles.map((muscle) => (
              <li key={muscle.id}>
                <input
                  type="checkbox"
                  checked={validSelectedMuscles.has(muscle.id)}
                  onChange={() => handleSelectMusle(muscle.id)}
                />
                {muscle.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listContent}
    </>
  );

  function handleShowMuscles() {
    setShowMuscles((show) => !show);
  }

  function handleAddExercise(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    onAddExercise(trimmedExerciseName, validSelectedMuscles);

    setExerciseName("");
    setSelectedMuscles(new Set());
  }

  function handleShowMuslesList() {
    setShowMuscleSelect((show) => !show);
  }

  function handleSelectMusle(muscleId: string) {
    const newSelectedMuscles = new Set(validSelectedMuscles);

    if (newSelectedMuscles.has(muscleId)) {
      newSelectedMuscles.delete(muscleId);
    } else {
      newSelectedMuscles.add(muscleId);
    }

    setSelectedMuscles(newSelectedMuscles);
  }
}
