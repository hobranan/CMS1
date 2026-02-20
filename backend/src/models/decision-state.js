export const DECISION_STATES = {
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  UNDER_REVIEW: "under_review"
};

export function isFinalDecision(status) {
  return status === DECISION_STATES.ACCEPTED || status === DECISION_STATES.REJECTED;
}
