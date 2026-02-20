export function renderPasswordChangeValidation(errors = []) {
  if (errors.length === 0) return "";
  return errors.map((e) => `${e.field}: ${e.message}`).join("; ");
}
