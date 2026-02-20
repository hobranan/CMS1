export function assignedAccessErrorMessage(response) {
  if (response.status === 404) {
    return response.body?.message ?? "Requested resource is unavailable.";
  }
  if (response.status >= 500) {
    return "System error. Please retry.";
  }
  return "";
}

