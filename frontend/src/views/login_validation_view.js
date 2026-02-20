export function renderRequiredFieldMessage(errors = []) {
  if (errors.length === 0) return "";
  return "Email and password are required.";
}
