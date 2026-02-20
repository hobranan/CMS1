export function mapDecisionNotificationError(error) {
  if (error.code === "FORBIDDEN") return { status: 403, body: { code: error.code, message: error.message } };
  if (error.code === "PAPER_NOT_FOUND") return { status: 404, body: { code: error.code, message: error.message } };
  if (error.code === "UNDER_REVIEW") return { status: 200, body: { decisionStatus: "under_review", message: error.message } };
  if (error.code === "NOTIFICATION_NOT_FOUND") return { status: 404, body: { code: error.code, message: error.message } };
  return { status: 500, body: { code: "DECISION_RETRIEVAL_FAILURE", message: "Decision details are temporarily unavailable." } };
}
