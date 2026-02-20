export function asSubmittedReviewRecord(row) {
  if (!row) return null;
  return Object.freeze({
    reviewId: row.reviewId,
    assignmentId: row.assignmentId,
    status: "submitted",
    versionNumber: row.versionNumber,
    previousReviewId: row.previousReviewId,
    recommendation: row.recommendation,
    comments: row.comments,
    fields: Object.freeze({ ...row.fields })
  });
}

