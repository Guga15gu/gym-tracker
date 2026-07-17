export { createExercise, createMuscle, createSet, };

function createMuscle(name){
  if (typeof name !== "string"){
    throw new Error("Name is not string");
  }

  return {id: crypto.randomUUID(), name};
}

function createExercise(name, muscles){
  if (typeof name !== "string"){
    throw new Error("Name is not string");
  }
  if (!Array.isArray(muscles)) {
    throw new Error("Muscles is not array");
  }
  if (muscles.length === 0) {
    throw new Error("Muscles is an empty array");
  }

  for(const muscle of muscles){
    if (typeof muscle !== "string"){
      throw new Error(`Muscle id ${muscle} is not a string`);
    }
  }

  return {id: crypto.randomUUID(), name, muscles};
}

function createSet(reps, weight){
  if (!Number.isFinite(reps)){
    throw new Error("Reps is not a finite number");
  }
  if (reps <= 0){
    throw new Error("Reps is negative or zero");
  }

  if (!Number.isFinite(weight)){
    throw new Error("Weight is not a finite number");
  }
  if (weight < 0){
    throw new Error("Weight is negative");
  }

  return {reps, weight};
}
