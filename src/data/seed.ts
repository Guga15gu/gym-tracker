/**
 * Seed data — derived from a FitNotes backup (2026-08-03).
 *
 * Catalog (muscles + exercises) and 3 templates built from the most recent
 * session of each recurring workout pattern:
 *   - "Push"      <- 2026-08-03  (chest / shoulders / triceps)
 *   - "Pull/Arms" <- 2026-07-28  (back / biceps / forearm)
 *   - "Upper"     <- 2026-07-24  (full upper body)
 *
 * Set values are the actual last-logged reps x kg for each exercise.
 * Names are PT translations of the FitNotes catalog — gym terminology is
 * subjective, rename freely in the UI.
 *
 * Catalog and templates are keyed by the (PT) display name so each template
 * reads like a plain list for review.
 */
import type { Exercise } from "./exercise";
import { createExercise } from "./exercise";
import type { ExerciseSet } from "./exerciseSet";
import { createExerciseSet } from "./exerciseSet";
import { addExercise } from "./exerciseStore";
import type { Muscle } from "./muscle";
import { createMuscle } from "./muscle";
import { addMuscle } from "./muscleStore";
import { createTemplate, createTemplateExercise } from "./template";
import { saveTemplate } from "./templateStore";

/** Build a list of sets from [reps, weight] pairs. */
function sets(pairs: [number, number][]): ExerciseSet[] {
  return pairs.map(([reps, weight]) => createExerciseSet(reps, weight));
}

export function seed() {
  const muscles = createMuscles();
  const exercises = createExercises(muscles);

  createPushTemplate(exercises);
  createPullArmsTemplate(exercises);
  createUpperTemplate(exercises);
}

function createMuscles(): Record<string, Muscle> {
  const muscles: Record<string, Muscle> = {};
  for (const name of [
    "peito",
    "costas",
    "ombro",
    "tríceps",
    "bíceps",
    "antebraço",
  ]) {
    const muscle = createMuscle(name);
    addMuscle(muscle);
    muscles[name] = muscle;
  }
  return muscles;
}

function createExercises(
  muscles: Record<string, Muscle>,
): Record<string, Exercise> {
  const exercises: Record<string, Exercise> = {};
  const add = (name: string, muscleName: string) => {
    const exercise = createExercise(name, [muscles[muscleName].id]);
    addExercise(exercise);
    exercises[name] = exercise;
  };

  // peito
  add("supino inclinado com halteres", "peito");
  add("supino reto com halteres", "peito");
  add("peck deck", "peito");
  // ombro
  add("desenvolvimento na máquina", "ombro");
  add("desenvolvimento sentado com halteres", "ombro");
  add("elevação lateral na polia", "ombro");
  add("elevação lateral com halteres", "ombro");
  add("crucifixo invertido na máquina", "ombro");
  add("crucifixo invertido com halter", "ombro");
  // tríceps
  add("tríceps na polia com corda", "tríceps");
  add("tríceps francês na polia", "tríceps");
  add("tríceps francês unilateral com halter", "tríceps");
  // bíceps
  add("rosca martelo com halter", "bíceps");
  add("rosca concentrada com halter", "bíceps");
  add("rosca direta com halter", "bíceps");
  add("rosca scott com halter", "bíceps");
  // costas
  add("barra fixa", "costas");
  add("puxada frontal", "costas");
  add("puxada frontal unilateral", "costas");
  add("remada na máquina", "costas");
  add("remada baixa na polia", "costas");
  // antebraço
  add("rosca de pulso na polia", "antebraço");
  add("rosca de pulso na polia (atrás)", "antebraço");

  return exercises;
}

function createPushTemplate(exercises: Record<string, Exercise>) {
  saveTemplate(
    createTemplate("Push", [
      createTemplateExercise(
        exercises["supino inclinado com halteres"].id,
        sets([
          [16, 12],
          [14, 16],
          [9, 20],
          [8, 20],
        ]),
      ),
      createTemplateExercise(
        exercises["desenvolvimento na máquina"].id,
        sets([
          [5, 40],
          [8, 35],
          [9, 30],
        ]),
      ),
      createTemplateExercise(
        exercises["peck deck"].id,
        sets([
          [7, 90],
          [8, 80],
          [6, 80],
        ]),
      ),
      createTemplateExercise(
        exercises["elevação lateral na polia"].id,
        sets([
          [10, 10],
          [10, 10],
          [7, 10],
        ]),
      ),
      createTemplateExercise(
        exercises["tríceps na polia com corda"].id,
        sets([
          [8, 40],
          [8, 40],
          [10, 30],
          [10, 30],
        ]),
      ),
      createTemplateExercise(
        exercises["crucifixo invertido na máquina"].id,
        sets([
          [16, 30],
          [16, 30],
        ]),
      ),
    ]),
  );
}

function createPullArmsTemplate(exercises: Record<string, Exercise>) {
  saveTemplate(
    createTemplate("Pull/Arms", [
      createTemplateExercise(
        exercises["barra fixa"].id,
        sets([
          [10, 0],
          [10, 0],
          [7, 0],
        ]),
      ),
      createTemplateExercise(
        exercises["remada na máquina"].id,
        sets([
          [12, 16],
          [12, 16],
          [12, 16],
        ]),
      ),
      createTemplateExercise(
        exercises["rosca martelo com halter"].id,
        sets([
          [6, 12],
          [12, 12],
          [10, 12],
        ]),
      ),
      createTemplateExercise(
        exercises["puxada frontal unilateral"].id,
        sets([
          [7, 25],
          [12, 20],
          [12, 20],
        ]),
      ),
      createTemplateExercise(
        exercises["rosca concentrada com halter"].id,
        sets([
          [10, 12],
          [12, 12],
          [10, 12],
        ]),
      ),
      createTemplateExercise(
        exercises["rosca de pulso na polia (atrás)"].id,
        sets([
          [13, 30],
          [13, 30],
        ]),
      ),
      createTemplateExercise(
        exercises["rosca de pulso na polia"].id,
        sets([
          [12, 20],
          [12, 20],
        ]),
      ),
      createTemplateExercise(
        exercises["rosca direta com halter"].id,
        sets([
          [10, 9],
          [10, 9],
        ]),
      ),
    ]),
  );
}

function createUpperTemplate(exercises: Record<string, Exercise>) {
  saveTemplate(
    createTemplate("Upper", [
      createTemplateExercise(
        exercises["supino reto com halteres"].id,
        sets([
          [16, 12],
          [13, 16],
          [8, 20],
          [8, 20],
        ]),
      ),
      createTemplateExercise(
        exercises["puxada frontal"].id,
        sets([
          [10, 50],
          [10, 50],
          [10, 50],
        ]),
      ),
      createTemplateExercise(
        exercises["desenvolvimento sentado com halteres"].id,
        sets([
          [8, 14],
          [8, 14],
          [7, 14],
        ]),
      ),
      createTemplateExercise(
        exercises["remada baixa na polia"].id,
        sets([
          [11, 50],
          [12, 50],
          [12, 50],
        ]),
      ),
      createTemplateExercise(
        exercises["elevação lateral na polia"].id,
        sets([
          [10, 10],
          [10, 10],
        ]),
      ),
      createTemplateExercise(
        exercises["rosca scott com halter"].id,
        sets([
          [12, 12],
          [12, 12],
          [10, 12],
        ]),
      ),
      createTemplateExercise(
        exercises["tríceps francês na polia"].id,
        sets([
          [16, 20],
          [9, 30],
          [6, 30],
          [6, 26],
        ]),
      ),
      createTemplateExercise(
        exercises["crucifixo invertido com halter"].id,
        sets([
          [14, 4],
          [14, 4],
        ]),
      ),
    ]),
  );
}
