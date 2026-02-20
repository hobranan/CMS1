import { isInvitationExpired } from "./invitation-expiry-service.js";

export function validateInvitationActionable({ invitation, now }) {
  if (!invitation) {
    return {
      ok: false,
      status: 400,
      code: "INVITATION_NOT_FOUND",
      message: "Invitation not found."
    };
  }
  if (invitation.status === "withdrawn") {
    return {
      ok: false,
      status: 400,
      code: "INVITATION_WITHDRAWN",
      message: "Invitation is withdrawn."
    };
  }
  if (invitation.status === "accepted" || invitation.status === "rejected") {
    return {
      ok: false,
      status: 400,
      code: "INVITATION_ALREADY_RESPONDED",
      message: "Invitation already responded."
    };
  }
  if (invitation.status !== "pending") {
    return {
      ok: false,
      status: 400,
      code: "INVITATION_NOT_ACTIONABLE",
      message: "Invitation is not actionable."
    };
  }
  if (isInvitationExpired({ issuedAtIso: invitation.issuedAt, now })) {
    return {
      ok: false,
      status: 400,
      code: "INVITATION_EXPIRED",
      message: "Invitation expired."
    };
  }
  return { ok: true };
}

