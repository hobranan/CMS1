export function renderSubmissionErrors(errors = []) {
  return errors.map((e) => `${e.field}: ${e.message}`);
}
