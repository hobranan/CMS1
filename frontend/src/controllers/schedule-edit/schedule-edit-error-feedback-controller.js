export function scheduleEditErrorFeedback(response) {
  if (response.status === 423) return "Editing is locked by policy.";
  if (response.status === 409) return "Schedule changed. Reload before saving.";
  if (response.status === 400) return response.body?.message ?? "Invalid schedule edits.";
  if (response.status === 500) return "Save failed. No changes persisted.";
  return "";
}
