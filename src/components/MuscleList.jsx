import { useState } from "react";

export default function MuscleList({ musclesList, onAddMuscle }) {
  const [muscleName, setMuscleName] = useState("");

  const muscles = Object.values(musclesList);
  const muscleQuery = muscleName.trim().toLowerCase();

  const filteredMuscles = muscles.filter((muscle) => {
    if (muscleQuery === "") {
      return true;
    }

    return muscle.name.toLowerCase().startsWith(muscleQuery);
  });

  function handleAddMuscle(e) {
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
          <li key={muscle.id}>{muscle.name}</li>
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
