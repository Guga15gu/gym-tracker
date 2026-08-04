import "./App.css";

import { useState } from "react";

import { getMuscles, addMuscle, deleteMuscle } from "./data/muscleStore";
import {
  getExercises,
  addExercise,
  deleteExercise,
} from "./data/exerciseStore";
import { createMuscle } from "./data/muscle";
import { createExercise } from "./data/exercise";
import {
  deleteTemplate,
  getTemplates,
  saveTemplate,
} from "./data/templateStore";
import { createTemplate, type Template } from "./data/template";

import MuscleList from "./components/MuscleList";
import ExerciseList from "./components/ExerciseList";
import TemplateList from "./components/TemplateList";
import TemplateEditor from "./components/TemplateEditor";
import WorkoutList from "./components/WorkoutList";
import WorkoutEditor from "./components/WorkoutEditor";
import { getWorkouts, saveWorkout } from "./data/workoutStore";
import WorkoutViewer from "./components/WorkoutViewer";
import { seed } from "./data/seed";
import { createDraft, type Draft } from "./data/draft";
import { createWorkout } from "./data/workout";
import { getDraft, saveDraft, clearDraft } from "./data/draftStore";

const TABS = {
  MUSCLES: "muscles",
  EXERCISES: "exercises",
  TEMPLATES: "templates",
  WORKOUTS: "workouts",
};

const TABS_ARRAY = [
  { id: TABS.MUSCLES, label: "Músculos" },
  { id: TABS.EXERCISES, label: "Exercícios" },
  { id: TABS.TEMPLATES, label: "Templates" },
  { id: TABS.WORKOUTS, label: "Workouts" },
];

const WORKOUT_VIEWS = { LIST: "list", EDITOR: "editor", VIEWER: "viewer" };

function App() {
  const [exercisesList, setExercisesList] = useState(() => getExercises());
  const [musclesList, setMusclesList] = useState(() => getMuscles());
  const [templatesList, setTemplatesList] = useState(() => getTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState(() => getDraft());
  const [workoutList, setWorkoutList] = useState(() => getWorkouts());
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );

  const [currentTab, setCurrentTab] = useState(TABS.MUSCLES);
  const [workoutView, setWorkoutView] = useState(WORKOUT_VIEWS.LIST);

  const usedMuscleIds = new Set<string>();
  for (const exercise of Object.values(exercisesList)) {
    for (const muscleId of exercise.muscles) {
      usedMuscleIds.add(muscleId);
    }
  }

  const usedExerciseIds = new Set<string>();
  for (const template of Object.values(templatesList)) {
    for (const exercise of template.exercises) {
      usedExerciseIds.add(exercise.exerciseId);
    }
  }
  for (const workout of Object.values(workoutList)) {
    for (const workoutExercise of workout.workoutExercises) {
      usedExerciseIds.add(workoutExercise.exerciseId);
    }
  }
  if (draft) {
    for (const workoutExercise of draft.workoutExercises) {
      usedExerciseIds.add(workoutExercise.exerciseId);
    }
  }

  const isEmpty =
    Object.keys(musclesList).length === 0 &&
    Object.keys(exercisesList).length === 0 &&
    Object.keys(templatesList).length === 0 &&
    Object.keys(workoutList).length === 0 &&
    draft === null;

  const RENDERS = {
    [TABS.MUSCLES]: () => (
      <MuscleList
        musclesList={musclesList}
        usedMuscleIds={usedMuscleIds}
        onAddMuscle={handleAddMuscle}
        onDeleteMuscle={handleDeleteMuscle}
      ></MuscleList>
    ),
    [TABS.EXERCISES]: () => (
      <ExerciseList
        exercisesList={exercisesList}
        musclesList={musclesList}
        usedExerciseIds={usedExerciseIds}
        onAddExercise={handleAddExercise}
        onDeleteExercise={handleDeleteExercise}
      ></ExerciseList>
    ),
    [TABS.TEMPLATES]: () => (
      <>
        <TemplateList
          templatesList={templatesList}
          onAddTemplate={handleAddTemplate}
          onSelectTemplate={handleSelectTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        ></TemplateList>

        {selectedTemplateId && (
          <TemplateEditor
            key={selectedTemplateId}
            template={templatesList[selectedTemplateId]}
            exercisesList={exercisesList}
            musclesList={musclesList}
            onUpdateTemplate={handleUpdateTemplate}
          ></TemplateEditor>
        )}
      </>
    ),
    [TABS.WORKOUTS]: () => {
      switch (workoutView) {
        case WORKOUT_VIEWS.LIST:
          return (
            <WorkoutList
              workoutList={workoutList}
              hasDraft={!!draft}
              selectedWorkoutId={selectedWorkoutId}
              onStartWorkout={handleStartWorkout}
              onSelectWorkout={handleSelectWorkout}
            ></WorkoutList>
          );
        case WORKOUT_VIEWS.VIEWER:
          if (!selectedWorkoutId) return;

          return (
            <WorkoutViewer
              workout={workoutList[selectedWorkoutId]}
              onBack={() => setWorkoutView(WORKOUT_VIEWS.LIST)}
            ></WorkoutViewer>
          );
        case WORKOUT_VIEWS.EDITOR:
          if (!draft) return;

          return (
            <WorkoutEditor
              draft={draft}
              exercisesList={exercisesList}
              musclesList={musclesList}
              templatesList={templatesList}
              onSaveDraft={handleSaveDraft}
              onFinalizeWorkout={handleFinalizeWorkout}
              onDiscardDraft={handleDiscardDraft}
              onBack={() => setWorkoutView(WORKOUT_VIEWS.LIST)}
            ></WorkoutEditor>
          );
        default:
          break;
      }
    },
  };

  return (
    <>
      <h1>Gym-Tracker</h1>
      <nav>
        {TABS_ARRAY.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            disabled={tab.id === currentTab}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {isEmpty && <button onClick={handleSeed}>Carregar seed default</button>}

      {TABS_ARRAY.map((tab) => (
        <div
          className={`tab-panel${tab.id !== currentTab ? " hidden" : ""}`}
          key={tab.id}
        >
          {RENDERS[tab.id]()}
        </div>
      ))}
    </>
  );

  function handleDeleteExercise(exerciseId: string) {
    if (usedExerciseIds.has(exerciseId)) {
      return;
    }

    setExercisesList((prev) => {
      const { [exerciseId]: deleted, ...rest } = prev;
      return rest;
    });
    deleteExercise(exerciseId);
  }

  function handleDeleteMuscle(muscleId: string) {
    if (usedMuscleIds.has(muscleId)) {
      return;
    }

    setMusclesList((prev) => {
      const { [muscleId]: deleted, ...rest } = prev;
      return rest;
    });
    deleteMuscle(muscleId);
  }

  function handleSeed() {
    seed();

    setMusclesList(getMuscles());
    setExercisesList(getExercises());
    setTemplatesList(getTemplates());
    setWorkoutList(getWorkouts());
  }
  function handleDeleteTemplate(templateId: string) {
    if (templateId === selectedTemplateId) {
      setSelectedTemplateId(null);
    }

    setTemplatesList((prev) => {
      const { [templateId]: deleted, ...rest } = prev;
      return rest;
    });
    deleteTemplate(templateId);
  }

  function handleSelectWorkout(workoutId: string) {
    setSelectedWorkoutId(workoutId);
    setWorkoutView(WORKOUT_VIEWS.VIEWER);
  }

  function handleStartWorkout() {
    if (draft) {
      setWorkoutView(WORKOUT_VIEWS.EDITOR);
    } else {
      const todayDate = new Date().toISOString().split("T")[0];
      const name = `Workout ${todayDate}`;
      const newDraft = createDraft(name, []);
      saveDraft(newDraft);
      setDraft(newDraft);
      setWorkoutView(WORKOUT_VIEWS.EDITOR);
    }
  }

  function handleFinalizeWorkout() {
    if (!draft) return;

    const finishedWorkout = createWorkout(draft);

    saveWorkout(finishedWorkout);
    setWorkoutList((prev) => ({
      ...prev,
      [finishedWorkout.id]: finishedWorkout,
    }));
    clearDraft();
    setDraft(null);
    setSelectedWorkoutId(finishedWorkout.id);
    setWorkoutView(WORKOUT_VIEWS.LIST);
  }

  function handleDiscardDraft() {
    setDraft(null);
    clearDraft();
    setWorkoutView(WORKOUT_VIEWS.LIST);
  }

  function handleSaveDraft(draft: Draft) {
    saveDraft(draft);
    setDraft(draft);
  }

  function handleAddExercise(
    exerciseName: string,
    selectedMuscles: Set<string>,
  ) {
    const newExercise = createExercise(exerciseName, [...selectedMuscles]);

    addExercise(newExercise);
    setExercisesList((prev) => ({ ...prev, [newExercise.id]: newExercise }));
  }

  function handleAddMuscle(muscleName: string) {
    const newMuscle = createMuscle(muscleName);

    addMuscle(newMuscle);
    setMusclesList((prev) => ({ ...prev, [newMuscle.id]: newMuscle }));
  }

  function handleAddTemplate(templateName: string) {
    const newTemplate = createTemplate(templateName, []);
    saveTemplate(newTemplate);

    setTemplatesList((prev) => ({ ...prev, [newTemplate.id]: newTemplate }));
    setSelectedTemplateId(newTemplate.id);
  }

  function handleSelectTemplate(templateId: string) {
    setSelectedTemplateId(templateId);
  }

  function handleUpdateTemplate(updatedTemplate: Template) {
    saveTemplate(updatedTemplate);

    setTemplatesList((prev) => ({
      ...prev,
      [updatedTemplate.id]: updatedTemplate,
    }));
  }
}

export default App;
