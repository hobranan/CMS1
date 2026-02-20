export function asCompletedReviewRecord(review, assignment) {
  if (!review || review.status !== "submitted") return null;
  return {
    reviewId: review.reviewId,
    assignmentId: review.assignmentId,
    paperId: assignment?.paperId ?? null,
    submittedAt: review.submittedAt,
    status: "submitted",
    recommendation: review.recommendation,
    comments: review.comments,
    fields: review.fields
  };
}
