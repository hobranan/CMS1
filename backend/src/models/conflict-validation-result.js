export function asConflictValidationResult({ valid, issues = [] }) {
  return { valid, issues };
}
