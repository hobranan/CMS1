import crypto from "node:crypto";

export class InvitationResponseRepository {
  constructor() {
    this.responsesByInvitation = new Map();
  }

  add({ invitationId, decision, responderRefereeId, now }) {
    if (this.responsesByInvitation.has(invitationId)) {
      const err = new Error("ALREADY_RESPONDED");
      err.code = "ALREADY_RESPONDED";
      throw err;
    }
    const response = {
      responseId: crypto.randomUUID(),
      invitationId,
      decision,
      responderRefereeId,
      recordedAt: now.toISOString()
    };
    this.responsesByInvitation.set(invitationId, response);
    return response;
  }

  getByInvitation(invitationId) {
    return this.responsesByInvitation.get(invitationId) ?? null;
  }

  remove(invitationId) {
    this.responsesByInvitation.delete(invitationId);
  }
}

