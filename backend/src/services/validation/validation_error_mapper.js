export function makeError(field, code, message) {
  return { field, code, message };
}

export function mapValidationResponse(errors) {
  return {
    code: "VALIDATION_FAILED",
    message: "Submission failed validation.",
    errors
  };
}
