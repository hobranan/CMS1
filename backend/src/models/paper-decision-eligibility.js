export function evaluateDecisionEligibility({ paper, editorId, allowNoReviewsOverride = false }) {
  if (!paper) return { ok: false, code: "PAPER_NOT_FOUND", status: 404, message: "Paper not found." };
  if (paper.editorId !== editorId) return { ok: false, code: "FORBIDDEN", status: 403, message: "Decision access denied." };
  if (paper.decisionPeriodOpen === false) return { ok: false, code: "DECISION_PERIOD_CLOSED", status: 403, message: "Decision period is closed." };
  if (paper.status === "accepted" || paper.status === "rejected") {
    return { ok: false, code: "ALREADY_DECIDED", status: 409, message: "Paper already has a final decision." };
  }
  if (!allowNoReviewsOverride && paper.completedReviewCount < 1) {
    return { ok: false, code: "NO_COMPLETED_REVIEWS", status: 403, message: "At least one completed review is required." };
  }
  return { ok: true };
}
