import { useState } from "react";
import {
  createExerciseSet,
  type ExerciseSet,
  isValidSetValue,
} from "../data/exerciseSet";
import type { SetDirtyMap, SetDirtyState } from "../utils/generateSetDirtyMap";
type SetsAreaProps = {
  sets: ExerciseSet[];
  setDirtyMap?: SetDirtyMap;
  onChangeSets: (sets: ExerciseSet[]) => void;
};
export default function SetsArea({
  sets,
  setDirtyMap,
  onChangeSets,
}: SetsAreaProps) {
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
                handleEditSet(set.id, e.target.value, String(set.weight))
              }
            />
            <div className={fieldClass(setDirtyMap?.[set.id], "reps")}>
              reps
            </div>
            <input
              type="number"
              value={set.weight}
              onChange={(e) =>
                handleEditSet(set.id, String(set.reps), e.target.value)
              }
            />
            <div className={fieldClass(setDirtyMap?.[set.id], "weight")}>
              kg
            </div>
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

  function fieldClass(
    state: SetDirtyState | undefined,
    field: "reps" | "weight",
  ): string {
    if (state === undefined) return "";
    else if (state.kind === "new") return "newSet";
    else if (field === "reps" && state.repsChanged) return "changedSet";
    else if (field === "weight" && state.weightChanged) return "changedSet";
    else return "";
  }

  function handleDeleteSet(setId: string) {
    onChangeSets(sets.filter((set) => set.id !== setId));
  }

  function handleEditSet(setId: string, repsStr: string, weightStr: string) {
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
