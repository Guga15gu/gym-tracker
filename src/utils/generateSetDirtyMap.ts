import type { ExerciseSet } from "../data/exerciseSet";

export type SetDirtyMap = Record<string, SetDirtyState>;

export type SetDirtyState =
  | { kind: "new" }
  | { kind: "modified"; repsChanged: boolean; weightChanged: boolean };

export function generateSetDirtyMap(
  originalSets: ExerciseSet[],
  draftSets: ExerciseSet[],
): SetDirtyMap {
  const map: SetDirtyMap = {};

  const originalSetsById: Record<string, ExerciseSet> = {};
  for (const originalSet of originalSets) {
    originalSetsById[originalSet.id] = originalSet;
  }

  for (const draftSet of draftSets) {
    const originalSet = originalSetsById[draftSet.id];

    if (originalSet) {
      const weightChanged = originalSet.weight !== draftSet.weight;
      const repsChanged = originalSet.reps !== draftSet.reps;

      if (weightChanged || repsChanged) {
        map[draftSet.id] = {
          kind: "modified",
          repsChanged: repsChanged,
          weightChanged: weightChanged,
        };
      }
    } else {
      map[draftSet.id] = { kind: "new" };
    }
  }
  return map;
}
