export function renderAllErrors(errors = []) {
  return errors.map((e) => `${e.field}: ${e.message}`);
}
