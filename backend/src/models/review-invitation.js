import crypto from "node:crypto";

export class ReviewInvitationRepository {
  constructor() {
    this.invitations = new Map();
  }

  create({ paperId, refereeId, issuedAt, status = "pending" }) {
    const invitationId = crypto.randomUUID();
    const row = {
      invitationId,
      paperId,
      refereeId,
      issuedAt,
      status,
      responseRecordedAt: null
    };
    this.invitations.set(invitationId, row);
    return row;
  }

  get(invitationId) {
    return this.invitations.get(invitationId) ?? null;
  }

  update(invitationId, updater) {
    const row = this.get(invitationId);
    if (!row) return null;
    updater(row);
    return row;
  }

  listByReferee(refereeId) {
    return [...this.invitations.values()].filter((row) => row.refereeId === refereeId);
  }
}

