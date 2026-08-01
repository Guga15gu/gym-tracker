import "./App.css";

import { useState } from "react";

import { getMuscles, addMuscle } from "./data/muscleStore";
import { getExercises, addExercise } from "./data/exerciseStore";
import { createMuscle } from "./data/muscle";
import { createExercise } from "./data/exercise";
import { getTemplates, saveTemplate } from "./data/templateStore";
import { createTemplate } from "./data/template";

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
} from "./data/workoutStore";
import WorkoutViewer from "./components/WorkoutViewer";
import { createWorkout } from "./data/workout";

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
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [workoutDraft, setWorkoutDraft] = useState(() => getWorkoutDraft());
  const [workoutList, setWorkoutList] = useState(() => getWorkouts());
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

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
          return (
            <WorkoutViewer
              workout={workoutList[selectedWorkoutId]}
              onBack={() => setWorkoutView(WORKOUT_VIEWS.LIST)}
            ></WorkoutViewer>
          );
        case WORKOUT_VIEWS.EDITOR:
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

  function handleSelectWorkout(workoutId) {
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
    saveWorkout(workoutDraft);
    setWorkoutList((prev) => ({ ...prev, [workoutDraft.id]: workoutDraft }));
    saveWorkoutDraft(null);
    setWorkoutDraft(null);
    setSelectedWorkoutId(workoutDraft.id);
    setWorkoutView(WORKOUT_VIEWS.LIST);
  }

  function handleDiscardDraft() {
    setWorkoutDraft(null);
    saveWorkoutDraft(null);
    setWorkoutView(WORKOUT_VIEWS.LIST);
  }

  function handleSaveDraft(draft) {
    saveWorkoutDraft(draft);
    setWorkoutDraft(draft);
  }

  function handleAddExercise(exerciseName, selectedMuscles) {
    const newExercise = createExercise(exerciseName, [...selectedMuscles]);

    addExercise(newExercise);
    setExercisesList((prev) => ({ ...prev, [newExercise.id]: newExercise }));
  }

  function handleAddMuscle(muscleName) {
    const newMuscle = createMuscle(muscleName);

    addMuscle(newMuscle);
    setMusclesList((prev) => ({ ...prev, [newMuscle.id]: newMuscle }));
  }

  function handleAddTemplate(templateName) {
    const newTemplate = createTemplate(templateName, []);
    saveTemplate(newTemplate);

    setTemplatesList((prev) => ({ ...prev, [newTemplate.id]: newTemplate }));
    setSelectedTemplateId(newTemplate.id);
  }

  function handleSelectTemplate(templateId) {
    setSelectedTemplateId(templateId);
  }

  function handleUpdateTemplate(updatedTemplate) {
    saveTemplate(updatedTemplate);

    setTemplatesList((prev) => ({
      ...prev,
      [updatedTemplate.id]: updatedTemplate,
    }));
  }
}

export default App;
