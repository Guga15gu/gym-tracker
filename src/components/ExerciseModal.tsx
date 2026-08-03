import type { Exercise } from "../data/exercise";

type ExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  exercisesList: Record<string, Exercise>;
  onSelect: (exerciseId: string) => void;
};
export default function ExerciseModal({
  isOpen,
  onClose,
  exercisesList,
  onSelect,
}: ExerciseModalProps) {
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
