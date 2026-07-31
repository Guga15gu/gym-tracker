export default function ExerciseModal({
  isOpen,
  onClose,
  exercisesList,
  onSelect,
}) {
  const exercises = Object.values(exercisesList);

  return (
    <dialog open={isOpen}>
      <button onClick={() => onClose()}>fechar</button>

      <div>Seleção de Exercise</div>
      <ul style={{ overflowY: "auto", maxHeight: "100px" }}>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <button onClick={() => onSelect(exercise.id)}>
              {exercise.name}
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
