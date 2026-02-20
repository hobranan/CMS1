export function renderWorkloadLimitError(response) {
  if (response.status === 409) {
    return "Workload or limit changed. Refresh and retry.";
  }
  if (response.status === 400) {
    return "Referee reached workload limit.";
  }
  return "";
}

