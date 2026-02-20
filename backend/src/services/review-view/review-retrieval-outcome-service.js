export function mapRetrievalOutcome(code) {
  if (code === "none_available") {
    return { status: 200, body: { reviews: [], message: "No completed reviews available." } };
  }
  if (code === "unauthorized") {
    return { status: 403, body: { code: "FORBIDDEN", message: "Review access denied." } };
  }
  if (code === "review_not_found") {
    return { status: 404, body: { code: "REVIEW_NOT_FOUND", message: "Completed review not found." } };
  }
  return { status: 500, body: { code: "RETRIEVAL_ERROR", message: "Completed reviews could not be retrieved." } };
}
