export function reviewSubmitFailureMessage(response) {
  if (response.status === 200 && response.body?.notificationStatus === "failed") {
    return "Review submitted, but notification failed.";
  }
  if (response.status === 500) {
    return "Review submission failed. Please retry.";
  }
  return "";
}

export function cancelBeforeSubmit() {
  return { cancelled: true, mutated: false };
}

