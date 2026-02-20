export function asAnonymizedReviewView(record) {
  return {
    reviewId: record.reviewId,
    assignmentId: record.assignmentId,
    paperId: record.paperId,
    submittedAt: record.submittedAt,
    recommendation: record.recommendation,
    comments: record.comments,
    fields: record.fields,
    identityRemoved: true
  };
}
