import { PaperDecisionViewRepository } from "../../models/paper-decision-repository.js";
import { getDecisionWithFailureHandling } from "../../services/decision-notification/get-decision-with-failure-handling.js";
import { mapDecisionNotificationError } from "./error-response-mapper.js";
import { enforceOwnershipOrThrow } from "./ownership-guard.js";

export function createGetPaperDecisionController(deps) {
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
          return {
            status: 200,
            body: {
              paperId: paper.paperId,
              decisionStatus: "under_review",
              sourceOfTruth: "cms",
              message: "Decision is still under review."
            }
          };
        }
        return {
          status: 200,
          body: {
            paperId: paper.paperId,
            decisionStatus: outcome.decisionStatus,
            decisionComment: outcome.decision.comment || null,
            sourceOfTruth: "cms",
            deliveryStatus: paper.notificationDeliveryStatus ?? "sent"
          }
        };
      } catch (error) {
        return mapDecisionNotificationError(error);
      }
    }
  };
}
