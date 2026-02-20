export function draftSubmitFeedback(response) {
  if (response.status === 200 && response.body?.status === "FINALIZED") {
    return "Draft finalized successfully.";
  }
  if (response.status === 409) {
    return "Submission blocked by final validation. Draft changes were saved.";
  }
  return "Submit failed.";
}
