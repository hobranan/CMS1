export function mapAssignedAccessFailure(status, code, message) {
  return {
    status,
    body: {
      code,
      message,
      retryable: status >= 500 || status === 404
    }
  };
}

