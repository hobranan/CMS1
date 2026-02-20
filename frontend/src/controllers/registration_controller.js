export function mapRegistrationErrors(errors) {
  const fieldErrors = {};
  for (const error of errors ?? []) {
    fieldErrors[error.field ?? "form"] = error.message;
  }
  return fieldErrors;
}

export function submitRegistration(apiClient, payload) {
  return apiClient("/api/v1/registrations:POST", { body: payload });
}
