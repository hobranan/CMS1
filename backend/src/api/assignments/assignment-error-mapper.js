export function mapAssignmentValidation(errors) {
  return {
    status: 400,
    body: {
      code: "ASSIGNMENT_VALIDATION_FAILED",
      message: "Assignment validation failed.",
      errors
    }
  };
}

