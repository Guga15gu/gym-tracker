import type { Draft } from "./draft";

export function getDraft(): Draft | null {
  const draft = localStorage.getItem("draft");

  if (draft === null) return null;

  return JSON.parse(draft) as Draft;
}

export function saveDraft(draft: Draft): void {
  localStorage.setItem("draft", JSON.stringify(draft));
}

export function clearDraft(): void {
  localStorage.removeItem("draft");
}
