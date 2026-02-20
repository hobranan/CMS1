export function createConflictRecord({ paperId, code, severity = "blocking", message }) {
  return { paperId, code, severity, message };
}
