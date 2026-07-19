import { getMuscles, addMuscle } from "../data/muscleStore";
import { createMuscle } from "../data/muscle";
import { useState } from "react";

export default function MuscleList() {
  const [musclesList, setMusclesList] = useState(getMuscles());

  const muscles = Object.values(musclesList);

  const [muscleName, setMuscleName] = useState("");

  function handleAddMuscle(e) {
    e.preventDefault();
    addMuscle(createMuscle(muscleName));
    setMusclesList(getMuscles());
    setMuscleName("");
  }

  return (
    <>
      <div>Músculos</div>

      <form onSubmit={handleAddMuscle}>
        <input
          value={muscleName}
          onChange={(e) => setMuscleName(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <div>input: {muscleName}</div>

      {muscles.length === 0 ? (
        <div>Sem músculos cadastrados</div>
      ) : (
        <ul>
          {muscles.map((muscle) => (
            <li key={muscle.id}>{muscle.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}
