export { getMuscles, addMuscle }

function getMuscles(){
    const muscles = localStorage.getItem("muscles");
    if (muscles === null){
        return {};
    }

    return JSON.parse(muscles);
}
function addMuscle(muscle){
    const muscles = getMuscles();
    muscles[muscle.id] = muscle;

    localStorage.setItem("muscles", JSON.stringify(muscles));
}