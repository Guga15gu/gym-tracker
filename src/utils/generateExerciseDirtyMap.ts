import type { TemplateExercise } from "../data/template";
import { generateSetDirtyMap, type SetDirtyMap } from "./generateSetDirtyMap";

export type ExerciseDirtyMap = Record<string, ExerciseDirtyState>;

type ExerciseDirtyState = {
  added: boolean;
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
      if (Object.keys(setDirtyMap).length > 0) {
        map[draftExercise.id] = {
          added: false,
          setDirtyMap: setDirtyMap,
        };
      }
    } else {
      map[draftExercise.id] = {
        added: true,
        setDirtyMap: generateSetDirtyMap([], draftExercise.sets),
      };
    }
  }
  return map;
}
