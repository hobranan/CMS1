import { computeExpiresAt, isInvitationExpired } from "./invitation-expiry-service.js";

export function projectPendingInvitations(reviewInvitationRepository, refereeId, now) {
  const rows = reviewInvitationRepository.listByReferee(refereeId);
  return rows
    .filter((row) => row.status === "pending" && !isInvitationExpired({ issuedAtIso: row.issuedAt, now }))
    .map((row) => ({
      invitationId: row.invitationId,
      paperId: row.paperId,
      refereeId: row.refereeId,
      issuedAt: row.issuedAt,
      expiresAt: computeExpiresAt(row.issuedAt),
      status: row.status
    }));
}

