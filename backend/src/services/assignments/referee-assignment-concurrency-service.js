export function validateAssignmentVersion(paper, expectedVersion) {
  if (expectedVersion === undefined || expectedVersion === null) {
    return { valid: true };
  }
  if (paper.version !== expectedVersion) {
    return {
      valid: false,
      code: "ASSIGNMENT_CONFLICT",
      message: "Assignment conflict detected. Reload paper and retry."
    };
  }
  return { valid: true };
}

