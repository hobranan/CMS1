export function mapAnonymizedReviewDetail(response) {
  if (response.status !== 200) return null;
  return {
    reviewId: response.body.reviewId,
    identityRemoved: response.body.identityRemoved,
    recommendation: response.body.recommendation,
    comments: response.body.comments,
    fields: response.body.fields
  };
}
