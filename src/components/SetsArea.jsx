import { useState } from "react";
import { createExerciseSet, isValidSetValue } from "../data/exerciseSet";

export default function SetsArea({ sets, onChangeSets }) {
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
            <input
              type="number"
              value={set.reps}
              style={{ width: "4em" }}
              onChange={(e) => handleEditSet(index, e.target.value, set.weight)}
            />
            reps
            <input
              type="number"
              value={set.weight}
              style={{ width: "4em" }}
              onChange={(e) => handleEditSet(index, set.reps, e.target.value)}
            />
            weight
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

  function handleEditSet(index, repsStr, weightStr) {
    const newRepsNum = Number(repsStr);
    const newWeightNum = Number(weightStr);

    if (!isValidSetValue(newRepsNum)) {
      return;
    }
    if (!isValidSetValue(newWeightNum)) {
      return;
    }

    const newSets = [...sets];
    newSets[index] = { reps: newRepsNum, weight: newWeightNum };
    onChangeSets(newSets);
  }

  function handleAddSet() {
    const newSet = createExerciseSet(newRepsNum, newWeightNum);
    const newSets = [...sets, newSet];
    onChangeSets(newSets);
  }
}
