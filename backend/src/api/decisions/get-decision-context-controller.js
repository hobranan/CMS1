import { validateDecisionEligibility } from "../../services/decisions/paper-decision-eligibility-service.js";

export function createGetDecisionContextController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Editor authentication is required." } };
      }

      const paperId = request.params?.paperId;
      const eligibility = validateDecisionEligibility(deps.paperDecisionRepository, {
        paperId,
        editorId: request.user.id,
        allowNoReviewsOverride: true
      });
      if (!eligibility.paper) {
        return { status: 404, body: { code: "PAPER_NOT_FOUND", message: "Paper not found." } };
      }
      if (eligibility.paper.editorId !== request.user.id) {
        return { status: 403, body: { code: "FORBIDDEN", message: "Decision access denied." } };
      }

      return {
        status: 200,
        body: {
          paperId,
          paperStatus: eligibility.paper.status,
          completedReviewCount: eligibility.paper.completedReviewCount,
          decisionPeriodOpen: eligibility.paper.decisionPeriodOpen,
          allowedOutcomes: ["accept", "reject"]
        }
      };
    }
  };
}
