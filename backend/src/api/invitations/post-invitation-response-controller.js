import { mapNotificationFailureMessage } from "./invitation-notification-failure-mapper.js";
import { mapInvitationResponseError } from "./invitation-response-error-mapper.js";
import { processInvitationResponse } from "../../services/invitations/process-invitation-response-service.js";

export function createPostInvitationResponseController(deps) {
  return {
    post: (request) => {
      if (!request.user?.email || request.user?.role !== "referee") {
        return {
          status: 401,
          body: { code: "AUTH_REQUIRED", message: "Referee authentication is required." }
        };
      }

      const decision = request.body?.decision;
      if (decision !== "accept" && decision !== "reject") {
        return {
          status: 400,
          body: { code: "INVALID_DECISION", message: "Decision must be accept or reject." }
        };
      }

      const result = processInvitationResponse(deps, {
        invitationId: request.params?.invitationId,
        decision,
        refereeId: request.user.id,
        expectedStatus: request.body?.expected_status
      });
      const mapped = mapInvitationResponseError(result);
      if (mapped.status === 200) {
        return {
          status: 200,
          body: mapNotificationFailureMessage(mapped.body)
        };
      }
      return mapped;
    }
  };
}

