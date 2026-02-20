export function mapAssignmentFailure(status, code, message) {
  return {
    status,
    body: {
      code,
      message
    }
  };
}

