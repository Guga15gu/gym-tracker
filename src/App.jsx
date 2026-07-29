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
  getWorkouts,
  saveWorkout,
  saveWorkoutDraft,
} from "./data/workoutStore";

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

function App() {
  const [exercisesList, setExercisesList] = useState(getExercises());
  const [musclesList, setMusclesList] = useState(getMuscles());
  const [templatesList, setTemplatesList] = useState(() => getTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [workoutDraft, setWorkoutDraft] = useState(null);
  const [workoutList, setWorkoutList] = useState(() => getWorkouts());

  const [currentTab, setCurrentTab] = useState(TABS.MUSCLES);

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
            onUpdateTemplate={handleUpdateTemplate}
          ></TemplateEditor>
        )}
      </>
    ),
    [TABS.WORKOUTS]: () => (
      <>
        <WorkoutList
          workoutList={workoutList}
          onNewWorkout={handleSaveDraft}
        ></WorkoutList>
        {workoutDraft && (
          <WorkoutEditor
            workoutDraft={workoutDraft}
            onSaveDraft={handleSaveDraft}
            exercisesList={exercisesList}
            musclesList={musclesList}
            onFinalizeWorkout={handleFinalizeWorkout}
          ></WorkoutEditor>
        )}
      </>
    ),
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
          key={tab.id}
          style={{ display: tab.id === currentTab ? "block" : "none" }}
        >
          {RENDERS[tab.id]()}
        </div>
      ))}
    </>
  );

  function handleFinalizeWorkout(newWorkout) {
    saveWorkout(newWorkout);
    setWorkoutList((prev) => ({ ...prev, [newWorkout.id]: newWorkout }));
    setWorkoutDraft(null);
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
