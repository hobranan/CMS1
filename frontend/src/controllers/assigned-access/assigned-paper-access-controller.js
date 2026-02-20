export function loadAssignedPapers(apiClient, refereeId, user) {
  return apiClient("/api/v1/referees/:refereeId/assigned-papers:GET", {
    params: { refereeId },
    user
  });
}

export function openManuscriptView(apiClient, paperId, user) {
  return apiClient("/api/v1/papers/:paperId/manuscript-view:GET", {
    params: { paperId },
    user
  });
}

export function openReviewForm(apiClient, paperId, user) {
  return apiClient("/api/v1/papers/:paperId/review-form:GET", {
    params: { paperId },
    user
  });
}

export function supportsManuscriptDownload() {
  return false;
}

