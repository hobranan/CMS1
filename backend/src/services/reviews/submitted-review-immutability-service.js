export function ensureSubmittedReviewReadOnly(review) {
  if (!review) return null;
  return {
    ...review,
    readOnly: true
  };
}

