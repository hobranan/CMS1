import { validateDecisionEligibility } from "./paper-decision-eligibility-service.js";
import { persistPaperDecision } from "./paper-decision-persistence-service.js";
import { detectDecisionConflict } from "./paper-decision-conflict-service.js";

export function processPaperDecision(deps, { paperId, editorId, outcome, comment, confirm, allowNoReviewsOverride }) {
  if (!confirm) {
    return { status: 200, body: { status: "cancelled", message: "Decision cancelled before confirmation." } };
  }

  const eligibility = validateDecisionEligibility(deps.paperDecisionRepository, {
    paperId,
    editorId,
    allowNoReviewsOverride
  });
  if (!eligibility.ok) {
    deps.paperDecisionObservabilityService?.record("paper_decision_blocked", { paperId, code: eligibility.code });
    return { status: eligibility.status, body: { code: eligibility.code, message: eligibility.message } };
  }

  const conflict = detectDecisionConflict(deps.paperDecisionRepository, paperId);
  if (conflict.conflict) {
    deps.paperDecisionObservabilityService?.record("paper_decision_blocked", { paperId, code: conflict.code });
    return { status: conflict.status, body: { code: conflict.code, message: conflict.message } };
  }

  const persisted = persistPaperDecision(deps.paperDecisionRepository, {
    paperId,
    editorId,
    outcome,
    comment,
    now: deps.nowProvider ? deps.nowProvider() : new Date()
  });
  if (!persisted.ok) {
    deps.paperDecisionObservabilityService?.record("paper_decision_failed", { paperId, code: persisted.code });
    return { status: persisted.status, body: { code: persisted.code, message: persisted.message } };
  }

  let notificationStatus = "sent";
  try {
    deps.paperDecisionNotificationService.notifyAuthors(persisted.decision, eligibility.paper);
  } catch {
    notificationStatus = "failed";
  }

  deps.paperDecisionObservabilityService?.record("paper_decision_recorded", {
    paperId,
    outcome,
    notificationStatus
  });

  return {
    status: 200,
    body: {
      decisionId: persisted.decision.decisionId,
      paperId,
      outcome,
      status: eligibility.paper.status,
      notificationStatus
    }
  };
}
