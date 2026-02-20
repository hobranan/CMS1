export function validationFailure(errors) {
  return {
    status: 400,
    body: {
      code: "SUBMISSION_VALIDATION_FAILED",
      message: "Submission contains invalid metadata or file values.",
      errors
    }
  };
}

export function storageFailure() {
  return {
    status: 503,
    body: {
      code: "SUBMISSION_STORAGE_UNAVAILABLE",
      message: "Temporary system problem. Please retry later."
    }
  };
}

export function interruptionResponse(submissionId) {
  return {
    status: 200,
    body: {
      status: "UPLOAD_INTERRUPTED",
      submission_id: submissionId,
      message: "Upload interrupted. Retry once network is available."
    }
  };
}
