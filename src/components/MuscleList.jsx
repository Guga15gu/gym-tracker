import { getMuscles, addMuscle } from "../data/muscleStore";
import { useState } from "react";

export default function MuscleList() {
  const [musclesList, setMusclesList] = useState(getMuscles());

  const muscles = Object.values(musclesList);
  console.log(muscles);
  console.log(muscles[0]);
  // queria fazer um for muscle in muscles e ir criando div por div, nsei sintax pra isso
  // e teria um if empty criaria uma div diferente
  // pos divs do for, teria uma div com um form e botao, nsei como que faz isso tbm
  // e antes das divs do for, teria uma div de busca, mas deixar isso para depois, teria que filtrar o array e atualizar a cada key,
  return (
    <>
      <div>Músculos</div>

      {muscles.length === 0 ? (
        <div>Sem músculos cadastrados</div>
      ) : (
        <ul>
          {muscles.map((muscle) => (
            <li key={muscle.id}>{muscle.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}
