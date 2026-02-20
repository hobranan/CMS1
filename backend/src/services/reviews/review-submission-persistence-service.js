export function persistReviewSubmission(repository, payload) {
  return repository.createSubmittedReview(payload);
}

