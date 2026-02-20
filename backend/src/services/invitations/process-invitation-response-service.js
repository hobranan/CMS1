import { validateInvitationActionable } from "./invitation-actionable-validation-service.js";

export function processInvitationResponse(deps, { invitationId, decision, refereeId, expectedStatus }) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const invitation = deps.reviewInvitationRepository.get(invitationId);
  if (!invitation || invitation.refereeId !== refereeId) {
    return {
      status: 400,
      body: {
        code: "INVITATION_NOT_FOUND",
        message: "Invitation not found."
      }
    };
  }

  if (expectedStatus && invitation.status !== expectedStatus) {
    return {
      status: 409,
      body: {
        code: "INVITATION_STATE_CONFLICT",
        message: "Invitation state changed. Refresh and try again."
      }
    };
  }

  const actionable = validateInvitationActionable({ invitation, now });
  if (!actionable.ok) {
    return {
      status: actionable.status,
      body: { code: actionable.code, message: actionable.message }
    };
  }

  try {
    deps.invitationResponsePersistenceService.persist({ invitation, decision, now });
  } catch {
    return {
      status: 500,
      body: {
        code: "INVITATION_DB_FAILURE",
        message: "Unable to record response. Invitation remains pending."
      }
    };
  }

  let notificationStatus = "sent";
  try {
    deps.invitationNotificationService.notifyEditor({
      invitationId,
      decision,
      paperId: invitation.paperId,
      refereeId
    });
  } catch {
    notificationStatus = "failed";
  }

  deps.invitationNotificationObservabilityService?.record("invitation_response_committed", {
    invitationId,
    decision,
    notificationStatus
  });

  return {
    status: 200,
    body: {
      invitationId,
      status: decision === "accept" ? "accepted" : "rejected",
      assignmentActive: decision === "accept",
      notificationStatus
    }
  };
}

