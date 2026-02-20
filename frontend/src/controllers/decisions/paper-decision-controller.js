export function loadDecisionContext(apiClient, paperId, user) {
  return apiClient("/api/v1/papers/:paperId/decision-context:GET", {
    params: { paperId },
    user
  });
}

export function submitPaperDecision(apiClient, paperId, payload, user) {
  return apiClient("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId },
    body: payload,
    user
  });
}
