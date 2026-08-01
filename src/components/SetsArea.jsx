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
    <div className="sets-area">
      <ul>
        {sets.map((set) => (
          <li key={set.id} className="set-item">
            <input
              type="number"
              value={set.reps}
              onChange={(e) =>
                handleEditSet(set.id, e.target.value, set.weight)
              }
            />
            <div>reps</div>
            <input
              type="number"
              value={set.weight}
              onChange={(e) => handleEditSet(set.id, set.reps, e.target.value)}
            />
            <div>kg</div>
            <button
              onClick={() => handleDeleteSet(set.id)}
              className="set-delete"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="set-item set-add">
        <input
          type="number"
          value={newReps}
          onChange={(e) => setNewReps(e.target.value)}
        />
        <div>reps</div>
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
        />
        <div>kg</div>
        <button onClick={handleAddSet} disabled={disableAddSet}>
          Adicionar
        </button>
      </div>
    </div>
  );

  function handleDeleteSet(setId) {
    onChangeSets(sets.filter((set) => set.id !== setId));
  }

  function handleEditSet(setId, repsStr, weightStr) {
    const newRepsNum = Number(repsStr);
    const newWeightNum = Number(weightStr);

    if (!isValidSetValue(newRepsNum)) {
      return;
    }
    if (!isValidSetValue(newWeightNum)) {
      return;
    }

    onChangeSets(
      sets.map((set) => {
        if (set.id === setId) {
          return { ...set, reps: newRepsNum, weight: newWeightNum };
        } else {
          return set;
        }
      }),
    );
  }

  function handleAddSet() {
    const newSet = createExerciseSet(newRepsNum, newWeightNum);
    const newSets = [...sets, newSet];
    onChangeSets(newSets);
  }
}
