import { useState } from "react";

export default function TemplateList({
  templatesList,
  onAddTemplate,
  onSelectTemplate,
  onDeleteTemplate,
}) {
  const [templateName, setTemplateName] = useState("");
  const templates = Object.values(templatesList);

  const trimmedTemplateName = templateName.trim();
  return (
    <>
      <h2>Templates: </h2>
      <form onSubmit={handleAddTemplate}>
        <input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <button type="submit" disabled={trimmedTemplateName === ""}>
          Adicionar template{" "}
        </button>
      </form>

      {templates.length === 0 ? (
        <div>Sem templates</div>
      ) : (
        <ul>
          {templates.map((template) => {
            return (
              <li key={template.id}>
                <button onClick={() => handleTemplateClick(template.id)}>
                  {template.name}
                </button>
                <button onClick={() => onDeleteTemplate(template.id)}>
                  Deletar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );

  function handleAddTemplate(e) {
    e.preventDefault();

    if (trimmedTemplateName === "") return;

    onAddTemplate(trimmedTemplateName);
    setTemplateName("");
  }

  function handleTemplateClick(templateId) {
    onSelectTemplate(templateId);
  }
}
