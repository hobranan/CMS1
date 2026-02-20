export function mapReviewValidationErrors(validationResult) {
  return {
    status: validationResult.status,
    body: {
      code: validationResult.code,
      message: validationResult.message,
      errors: validationResult.errors
    }
  };
}

