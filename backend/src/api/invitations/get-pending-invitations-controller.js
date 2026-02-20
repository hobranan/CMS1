import { projectPendingInvitations } from "../../services/invitations/invitation-list-projection-service.js";

export function createGetPendingInvitationsController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "referee") {
        return {
          status: 401,
          body: { code: "AUTH_REQUIRED", message: "Referee authentication is required." }
        };
      }
      const refereeId = request.params?.refereeId;
      if (refereeId !== request.user.id) {
        return {
          status: 401,
          body: { code: "AUTH_REQUIRED", message: "Referee identity mismatch." }
        };
      }
      const now = deps.nowProvider ? deps.nowProvider() : new Date();
      const invitations = projectPendingInvitations(deps.reviewInvitationRepository, refereeId, now);
      return {
        status: 200,
        body: { invitations }
      };
    }
  };
}

