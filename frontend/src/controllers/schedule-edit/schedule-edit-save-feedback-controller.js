export function scheduleEditSaveFeedback(response) {
  return response.status === 200 ? "Schedule saved." : "Schedule save failed.";
}
