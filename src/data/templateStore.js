export { getTemplates, addTemplate };

function getTemplates() {
  const templates = localStorage.getItem("templates");
  if (templates === null) {
    return {};
  }

  return JSON.parse(templates);
}
function addTemplate(template) {
  const templates = getTemplates();
  templates[template.id] = template;

  localStorage.setItem("templates", JSON.stringify(templates));
}
