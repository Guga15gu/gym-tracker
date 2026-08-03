import type { Template } from "./template";

export function getTemplates(): Record<string, Template> {
  const templates = localStorage.getItem("templates");
  if (templates === null) {
    return {};
  }

  return JSON.parse(templates) as Record<string, Template>;
}

export function saveTemplate(template: Template): void {
  const templates = getTemplates();
  templates[template.id] = template;

  localStorage.setItem("templates", JSON.stringify(templates));
}

export function deleteTemplate(templateId: string): void {
  const { [templateId]: deleted, ...rest } = getTemplates();

  localStorage.setItem("templates", JSON.stringify(rest));
}
