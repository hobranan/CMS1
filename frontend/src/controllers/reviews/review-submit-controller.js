export function loadReviewDraft(apiClient, assignmentId, user) {
  return apiClient("/api/v1/assignments/:assignmentId/review-draft:GET", {
    params: { assignmentId },
    user
  });
}

export function submitReview(apiClient, assignmentId, payload, user) {
  return apiClient("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId },
    body: payload,
    user
  });
}

export function reviewFormReadOnlyState(submitResponse) {
  return submitResponse.status === 200 && submitResponse.body?.status === "submitted";
}

