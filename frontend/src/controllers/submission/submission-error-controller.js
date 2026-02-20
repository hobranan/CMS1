export function submissionErrorMessage(response) {
  if (response.status === 503) return "Temporary system problem. Please retry later.";
  if (response.status === 400) return "Submission has errors. Please correct and resubmit.";
  return "Upload interrupted. Retry when network is available.";
}
