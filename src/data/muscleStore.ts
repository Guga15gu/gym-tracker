import type { Muscle } from "./muscle";

export function getMuscles(): Record<string, Muscle> {
  const muscles = localStorage.getItem("muscles");
  if (muscles === null) {
    return {};
  }

  return JSON.parse(muscles) as Record<string, Muscle>;
}

export function addMuscle(muscle: Muscle): void {
  const muscles = getMuscles();
  muscles[muscle.id] = muscle;

  localStorage.setItem("muscles", JSON.stringify(muscles));
}

export function deleteMuscle(muscleId: string): void {
  const { [muscleId]: deleted, ...rest } = getMuscles();
  localStorage.setItem("muscles", JSON.stringify(rest));
}
