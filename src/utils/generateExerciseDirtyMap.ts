import type { TemplateExercise } from "../data/template";
import { generateSetDirtyMap, type SetDirtyMap } from "./generateSetDirtyMap";

export type ExerciseDirtyMap = Record<string, ExerciseDirtyState>;

type ExerciseDirtyState = {
  added: boolean;
  replaced: boolean;
  setDirtyMap: SetDirtyMap;
};

export function generateExerciseDirtyMap(
  originalExercises: TemplateExercise[],
  draftExercises: TemplateExercise[],
): ExerciseDirtyMap {
  const map: ExerciseDirtyMap = {};

  const originalExercisesById: Record<string, TemplateExercise> = {};
  for (const originalExercise of originalExercises) {
    originalExercisesById[originalExercise.id] = originalExercise;
  }

  for (const draftExercise of draftExercises) {
    const originalExercise = originalExercisesById[draftExercise.id];

    if (originalExercise) {
      const setDirtyMap = generateSetDirtyMap(
        originalExercise.sets,
        draftExercise.sets,
      );
      const isReplaced =
        originalExercise.exerciseId !== draftExercise.exerciseId;

      if (isReplaced || Object.keys(setDirtyMap).length > 0) {
        map[draftExercise.id] = {
          added: false,
          replaced: isReplaced,
          setDirtyMap: setDirtyMap,
        };
      }
    } else {
      map[draftExercise.id] = {
        added: true,
        replaced: false,
        setDirtyMap: generateSetDirtyMap([], draftExercise.sets),
      };
    }
  }
  return map;
}
