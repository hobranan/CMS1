export function workloadFailureMessage(response) {
  if (response.status === 503) {
    return "System temporarily unavailable. Retry assignment.";
  }
  return "Assignment failed.";
}

