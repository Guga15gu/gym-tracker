export { getTemplates, saveTemplate };

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

