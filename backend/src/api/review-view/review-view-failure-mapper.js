export function mapReviewViewFailure() {
  return { status: 500, body: { code: "RETRIEVAL_ERROR", message: "Completed reviews could not be retrieved." } };
}
