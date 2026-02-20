export function loadCompletedReviews(apiClient, paperId, user) {
  return apiClient("/api/v1/papers/:paperId/completed-reviews:GET", {
    params: { paperId },
    user
  });
}

export function loadCompletedReviewDetail(apiClient, paperId, reviewId, user) {
  return apiClient("/api/v1/papers/:paperId/completed-reviews/:reviewId:GET", {
    params: { paperId, reviewId },
    user
  });
}
