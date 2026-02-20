export function mapReviewViewAuthorizationError() {
  return { status: 403, body: { code: "FORBIDDEN", message: "Review access denied." } };
}
