import type { ExerciseSet } from "./exerciseSet";

export type Template = {
  id: string;
  name: string;
  exercises: TemplateExercise[];
};
export type TemplateExercise = {
  id: string;
  exerciseId: string;
  sets: ExerciseSet[];
};

/**
 * @throws {Error} if exerciseId is not string
 * @throws {Error} if sets is not array
 */
export function createTemplateExercise(
  exerciseId: string,
  sets: ExerciseSet[],
): TemplateExercise {
  if (typeof exerciseId !== "string") {
    throw new Error("exerciseId is not string");
  }

  if (!Array.isArray(sets)) {
    throw new Error("sets is not array");
  }

  return { id: crypto.randomUUID(), exerciseId: exerciseId, sets: sets };
}

/**
 * @throws {Error} if name is not string or empty
 * @throws {Error} if exercises is not a array
 */
export function createTemplate(
  name: string,
  exercises: TemplateExercise[],
): Template {
  if (typeof name !== "string") {
    throw new Error("Name is not string");
  }
  const trimmedName = name.trim();
  if (trimmedName === "") {
    throw new Error("Name is empty");
  }

  if (!Array.isArray(exercises)) {
    throw new Error("exercises is not array");
  }

  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    exercises: exercises,
  };
}
