export { getTemplates, saveTemplate, deleteTemplate };

function getTemplates() {
  const templates = localStorage.getItem("templates");
  if (templates === null) {
    return {};
  }

  return JSON.parse(templates);
}

function saveTemplate(template) {
  const templates = getTemplates();
  templates[template.id] = template;

  localStorage.setItem("templates", JSON.stringify(templates));
}

function deleteTemplate(templateId) {
  const { [templateId]: deleted, ...rest } = getTemplates();

  localStorage.setItem("templates", JSON.stringify(rest));
}
