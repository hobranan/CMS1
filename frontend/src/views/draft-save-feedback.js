export function draftSaveFeedback(response) {
  const status = response?.body?.status;
  if (status === "SAVED") return "Draft saved.";
  if (status === "NO_CHANGES") return "No new changes to save.";
  if (status === "VALIDATION_FAILED") return "Draft save has validation errors.";
  return "Draft save failed.";
}
