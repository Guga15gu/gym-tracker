import { useState } from "react";
import { addTemplate, getTemplates } from "../data/templateStore";
import { createTemplate } from "../data/template";

export default function TemplateList() {
  const [templatesList, setTemplatesList] = useState(() => getTemplates());
  const [templateName, setTemplateName] = useState("");
  const templates = Object.values(templatesList);

  const trimmedTemplateName = templateName.trim();
  return (
    <>
      <div>Templates: </div>
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

    const newTemplate = createTemplate(trimmedTemplateName, []);
    addTemplate(newTemplate);
    setTemplateName("");
    setTemplatesList((prev) => ({ ...prev, [newTemplate.id]: newTemplate }));
  }

  function handleTemplateClick(templateId) {
    console.log(`clicked on ${templateId}: ${templatesList[templateId].name}`);
  }
}
