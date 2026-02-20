import { createGetPendingInvitationsController } from "./get-pending-invitations-controller.js";
import { createPostInvitationResponseController } from "./post-invitation-response-controller.js";

export function createInvitationRoutes(deps) {
  const getPendingController = createGetPendingInvitationsController(deps);
  const postResponseController = createPostInvitationResponseController(deps);
  return {
    "/api/v1/referees/:refereeId/invitations/pending:GET": getPendingController.get,
    "/api/v1/invitations/:invitationId/response:POST": postResponseController.post
  };
}

