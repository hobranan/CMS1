export function mapDecisionFailure(response) {
  if (response.status === 500) return "Decision could not be saved. Please retry.";
  if (response.status === 200 && response.body?.notificationStatus === "failed") {
    return "Decision saved, but notifications failed.";
  }
  if (response.status === 409) return "A concurrent decision already finalized this paper.";
  return "";
}
