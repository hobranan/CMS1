export const VALIDATION_CONFIG = {
  pipelineOrder: ["required", "format", "business"],
  responseKeys: ["field", "code", "message"],
  codes: {
    validationFailed: "VALIDATION_FAILED",
    unauthorized: "AUTH_REQUIRED",
    persistenceFailed: "PERSISTENCE_FAILED"
  }
};
