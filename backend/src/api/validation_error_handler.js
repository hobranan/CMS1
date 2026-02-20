export function handleValidationError(error) {
  return {
    status: 500,
    body: {
      code: "PERSISTENCE_FAILED",
      message: "Could not save submission. Please retry."
    }
  };
}
