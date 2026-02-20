export function assignmentFailureMessage(response) {
  if (response.status === 409) {
    return "Assignment conflict detected. Reload and retry.";
  }
  if (response.status === 503) {
    return "Assignment failed and was rolled back. Please retry.";
  }
  return "Assignment failed.";
}

