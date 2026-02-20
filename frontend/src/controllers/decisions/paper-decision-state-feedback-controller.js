export function mapDecisionStateFeedback(response) {
  if (response.status === 403) return "Decision is not allowed for this paper right now.";
  if (response.status === 409) return "A final decision already exists for this paper.";
  if (response.status === 200 && response.body?.status === "cancelled") return "Decision was cancelled.";
  return "";
}
