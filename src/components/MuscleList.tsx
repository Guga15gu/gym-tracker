import { useState, type SubmitEvent } from "react";
import type { Muscle } from "../data/muscle";

type MuscleListProps = {
  musclesList: Record<string, Muscle>;
  usedMuscleIds: Set<string>;
  onAddMuscle: (muscleName: string) => void;
  onDeleteMuscle: (muscleId: string) => void;
};
export default function MuscleList({
  musclesList,
  usedMuscleIds,
  onAddMuscle,
  onDeleteMuscle,
}: MuscleListProps) {
  const [muscleName, setMuscleName] = useState("");

  const muscles = Object.values(musclesList);
  const muscleQuery = muscleName.trim().toLowerCase();

  const filteredMuscles = muscles.filter((muscle) => {
    if (muscleQuery === "") {
      return true;
    }

    return muscle.name.toLowerCase().startsWith(muscleQuery);
  });

  function handleAddMuscle(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onAddMuscle(muscleName);
    setMuscleName("");
  }

  let listContent;
  if (muscles.length === 0) {
    listContent = <div>Sem músculos cadastrados</div>;
  } else if (filteredMuscles.length === 0) {
    listContent = <div>Não encontrado</div>;
  } else {
    listContent = (
      <ul>
        {filteredMuscles.map((muscle) => (
          <li key={muscle.id}>
            {muscle.name}{" "}
            <button
              onClick={() => onDeleteMuscle(muscle.id)}
              disabled={usedMuscleIds.has(muscle.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <h2>Músculos</h2>

      <form onSubmit={handleAddMuscle}>
        <input
          value={muscleName}
          onChange={(e) => setMuscleName(e.target.value)}
        />
        <button type="submit" disabled={muscleQuery === ""}>
          Adicionar
        </button>
      </form>

      <div>input: {muscleName}</div>

      {listContent}
    </>
  );
}
