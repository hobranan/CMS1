export function mapReviewOpenFailure(response) {
  if (response.status === 404) return "This review is no longer available.";
  if (response.status === 403) return "You are not allowed to view this review.";
  return "Unable to open the review right now.";
}
