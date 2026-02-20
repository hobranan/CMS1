import { processPaperDecision } from "../../services/decisions/process-paper-decision-service.js";
import { mapPaperDecisionNotificationFailure } from "./paper-decision-notification-failure-mapper.js";

export function createPostPaperDecisionController(deps) {
  return {
    post: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Editor authentication is required." } };
      }

      const paperId = request.params?.paperId;
      const outcome = request.body?.outcome;
      const comment = request.body?.comment ?? "";
      const confirm = request.body?.confirm === true;
      const allowNoReviewsOverride = request.body?.allowNoReviewsOverride === true;

      if (!["accept", "reject"].includes(outcome)) {
        return { status: 422, body: { code: "INVALID_DECISION", message: "Outcome must be accept or reject." } };
      }

      const response = processPaperDecision(deps, {
        paperId,
        editorId: request.user.id,
        outcome,
        comment,
        confirm,
        allowNoReviewsOverride
      });

      if (response.status === 200 && response.body.notificationStatus === "failed") {
        return { status: 200, body: mapPaperDecisionNotificationFailure(response.body) };
      }
      return response;
    }
  };
}
