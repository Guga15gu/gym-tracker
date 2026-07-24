import "./App.css";

import { useState } from "react";

import { getMuscles, addMuscle } from "./data/muscleStore";
import { getExercises, addExercise } from "./data/exerciseStore";
import { createMuscle } from "./data/muscle";
import { createExercise } from "./data/exercise";
import { getTemplates, addTemplate } from "./data/templateStore";
import { createTemplate } from "./data/template";

import MuscleList from "./components/MuscleList";
import ExerciseList from "./components/ExerciseList";
import TemplateList from "./components/TemplateList";

function App() {
  const [exercisesList, setExercisesList] = useState(getExercises());
  const [musclesList, setMusclesList] = useState(getMuscles());
  const [templatesList, setTemplatesList] = useState(() => getTemplates());

  if (false) {
    return (
      <>
        <MuscleList
          musclesList={musclesList}
          onAddMuscle={handleAddMuscle}
        ></MuscleList>
        <ExerciseList
          exercisesList={exercisesList}
          musclesList={musclesList}
          onAddExercise={handleAddExercise}
        ></ExerciseList>
      </>
    );
  } else {
    return (
      <>
        <TemplateList
          templatesList={templatesList}
          onAddTemplate={handleAddTemplate}
        ></TemplateList>
      </>
    );
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
    addTemplate(newTemplate);

    setTemplatesList((prev) => ({ ...prev, [newTemplate.id]: newTemplate }));
  }
}

export default App;
