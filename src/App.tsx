import "./App.css";

import { useState } from "react";

import { getMuscles, addMuscle } from "./data/muscleStore";
import { getExercises, addExercise } from "./data/exerciseStore";
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
import {
  getWorkoutDraft,
  getWorkouts,
  saveWorkout,
  saveWorkoutDraft,
  clearWorkoutDraft,
} from "./data/workoutStore";
import WorkoutViewer from "./components/WorkoutViewer";
import { createWorkout, type Workout } from "./data/workout";

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
  const [exercisesList, setExercisesList] = useState(getExercises());
  const [musclesList, setMusclesList] = useState(getMuscles());
  const [templatesList, setTemplatesList] = useState(() => getTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [workoutDraft, setWorkoutDraft] = useState(() => getWorkoutDraft());
  const [workoutList, setWorkoutList] = useState(() => getWorkouts());
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );

  const [currentTab, setCurrentTab] = useState(TABS.MUSCLES);
  const [workoutView, setWorkoutView] = useState(WORKOUT_VIEWS.LIST);

  const RENDERS = {
    [TABS.MUSCLES]: () => (
      <MuscleList
        musclesList={musclesList}
        onAddMuscle={handleAddMuscle}
      ></MuscleList>
    ),
    [TABS.EXERCISES]: () => (
      <ExerciseList
        exercisesList={exercisesList}
        musclesList={musclesList}
        onAddExercise={handleAddExercise}
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
              hasDraft={!!workoutDraft}
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
          if (!workoutDraft) return;

          return (
            <WorkoutEditor
              workoutDraft={workoutDraft}
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
    if (workoutDraft) {
      setWorkoutView(WORKOUT_VIEWS.EDITOR);
    } else {
      const todayDate = new Date().toISOString().split("T")[0];
      const name = `Workout ${todayDate}`;
      const newWorkout = createWorkout(name, []);
      saveWorkoutDraft(newWorkout);
      setWorkoutDraft(newWorkout);
      setWorkoutView(WORKOUT_VIEWS.EDITOR);
    }
  }

  function handleFinalizeWorkout() {
    if (!workoutDraft) return;

    saveWorkout(workoutDraft);
    setWorkoutList((prev) => ({ ...prev, [workoutDraft.id]: workoutDraft }));
    clearWorkoutDraft();
    setWorkoutDraft(null);
    setSelectedWorkoutId(workoutDraft.id);
    setWorkoutView(WORKOUT_VIEWS.LIST);
  }

  function handleDiscardDraft() {
    setWorkoutDraft(null);
    clearWorkoutDraft();
    setWorkoutView(WORKOUT_VIEWS.LIST);
  }

  function handleSaveDraft(draft: Workout) {
    saveWorkoutDraft(draft);
    setWorkoutDraft(draft);
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
