import { createExercise } from "./exercise";
import { createExerciseSet } from "./exerciseSet";
import { addExercise } from "./exerciseStore";
import { createMuscle } from "./muscle";
import { addMuscle } from "./muscleStore";
import { createTemplate, createTemplateExercise } from "./template";
import { saveTemplate } from "./templateStore";

export function seed() {
  const peito = createMuscle("peito");
  addMuscle(peito);
  const ombro = createMuscle("ombro");
  addMuscle(ombro);
  const triceps = createMuscle("triceps");
  addMuscle(triceps);

  const supinoInclinadoHalteres = createExercise(
    "supino inclinado com halteres",
    [peito.id],
  );
  addExercise(supinoInclinadoHalteres);

  const sets1 = [
    createExerciseSet(10, 20),
    createExerciseSet(9, 20),
    createExerciseSet(8, 20),
  ];
  const templateExercise1 = createTemplateExercise(
    supinoInclinadoHalteres.id,
    sets1,
  );
  const template1 = createTemplate("push1", [templateExercise1]);
  saveTemplate(template1);
}
