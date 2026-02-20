export function mapValidationErrors(errors) {
  return {
    code: "VALIDATION_FAILED",
    message: "Registration validation failed.",
    errors
  };
}

export function mapError(code, message, extra = {}) {
  return { code, message, ...extra };
}
