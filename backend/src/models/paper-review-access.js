export function canEditorAccessPaper(assignment, editorId) {
  return Boolean(assignment && assignment.editorId === editorId);
}
