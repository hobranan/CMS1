export function renderValidationResult(response) {
  if (response.status === 200) return "Submission saved successfully.";
  if (response.status === 422) return "Please fix highlighted field errors.";
  return "Submission could not be processed.";
}
