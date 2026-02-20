import { PaperDecisionViewRepository } from "../../models/paper-decision-repository.js";
import { getDecisionWithFailureHandling } from "../../services/decision-notification/get-decision-with-failure-handling.js";
import { generateDecisionNotification } from "../../services/decision-notification/generate-decision-notification.js";
import { mapDecisionNotificationError } from "./error-response-mapper.js";
import { enforceOwnershipOrThrow } from "./ownership-guard.js";

export function createGetDecisionNotificationController(deps) {
  const repository = new PaperDecisionViewRepository(deps.paperDecisionRepository);

  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "author") {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Author authentication is required." } };
      }

      try {
        const paper = enforceOwnershipOrThrow(repository, {
          paperId: request.params?.paperId,
          authorId: request.user.id
        });
        const outcome = getDecisionWithFailureHandling(repository, paper.paperId);
        if (outcome.decisionStatus === "under_review") {
          const err = new Error("Decision not available yet.");
          err.code = "UNDER_REVIEW";
          throw err;
        }
        if (paper.notificationAvailable === false) {
          const err = new Error("Decision notification not found.");
          err.code = "NOTIFICATION_NOT_FOUND";
          throw err;
        }

        return {
          status: 200,
          body: generateDecisionNotification({
            paper,
            decision: outcome.decision,
            decisionStatus: outcome.decisionStatus,
            deliveryStatus: paper.notificationDeliveryStatus ?? "sent"
          })
        };
      } catch (error) {
        return mapDecisionNotificationError(error);
      }
    }
  };
}
