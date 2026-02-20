export function reviewViewFeedbackMessage(response) {
  if (response.status === 200 && Array.isArray(response.body?.reviews) && response.body.reviews.length === 0) {
    return "No completed reviews are available for this paper yet.";
  }
  if (response.status === 403) return "You are not allowed to view reviews for this paper.";
  if (response.status >= 500) return "The review list could not be loaded.";
  return "";
}
