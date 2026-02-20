import { asReviewVersionLink } from "../../models/review-version-link.js";

export function getVersionLinkForSubmission(submittedReview) {
  if (!submittedReview?.previousReviewId) {
    return null;
  }
  return asReviewVersionLink(submittedReview.previousReviewId, submittedReview.reviewId);
}

