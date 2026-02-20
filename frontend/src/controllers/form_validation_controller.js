export function submitFormForValidation(apiClient, payload, user) {
  return apiClient("/api/v1/forms/submit:POST", { body: payload, user });
}

export function mapFieldErrors(errors = []) {
  const mapped = {};
  for (const err of errors) {
    mapped[err.field] = err.message;
  }
  return mapped;
}
