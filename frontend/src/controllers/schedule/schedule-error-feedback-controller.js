export function scheduleErrorMessage(response) {
  if (response.status === 400) return response.body?.message ?? "Schedule request is invalid.";
  if (response.status === 500) return "Schedule save failed. Retry.";
  return "";
}
