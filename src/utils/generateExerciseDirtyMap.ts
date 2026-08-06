import type { TemplateExercise } from "../data/template";
import { generateSetDirtyMap, type SetDirtyMap } from "./generateSetDirtyMap";

export type ExerciseDirtyMap = Record<string, SetDirtyMap>;

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
      map[draftExercise.id] = generateSetDirtyMap(
        originalExercise.sets,
        draftExercise.sets,
      );
    } else {
      map[draftExercise.id] = generateSetDirtyMap([], draftExercise.sets);
    }
  }
  return map;
}
