export function loadPaperDecision(apiClient, paperId, user) {
  return apiClient("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId },
    user
  });
}

export function loadDecisionNotification(apiClient, paperId, user) {
  return apiClient("/api/v1/author/papers/:paperId/decision-notification:GET", {
    params: { paperId },
    user
  });
}

export function cmsFallbackMessage(viewModel) {
  return viewModel.deliveryStatus === "failed"
    ? "Notification delivery failed. CMS decision details are the source of truth."
    : "";
}
