export class InvitationResponsePersistenceService {
  constructor(reviewInvitationRepository, invitationResponseRepository, reviewAssignmentActivationRepository) {
    this.reviewInvitationRepository = reviewInvitationRepository;
    this.invitationResponseRepository = invitationResponseRepository;
    this.reviewAssignmentActivationRepository = reviewAssignmentActivationRepository;
    this.failNext = false;
  }

  failNextWrite() {
    this.failNext = true;
  }

  persist({ invitation, decision, now }) {
    if (this.failNext) {
      this.failNext = false;
      const err = new Error("INVITATION_DB_FAILURE");
      err.code = "INVITATION_DB_FAILURE";
      throw err;
    }

    const previousStatus = invitation.status;
    let response;
    try {
      response = this.invitationResponseRepository.add({
        invitationId: invitation.invitationId,
        decision,
        responderRefereeId: invitation.refereeId,
        now
      });
      this.reviewInvitationRepository.update(invitation.invitationId, (row) => {
        row.status = decision === "accept" ? "accepted" : "rejected";
        row.responseRecordedAt = now.toISOString();
      });
      if (decision === "accept") {
        this.reviewAssignmentActivationRepository.activate({
          invitationId: invitation.invitationId,
          paperId: invitation.paperId,
          refereeId: invitation.refereeId,
          now
        });
      } else {
        this.reviewAssignmentActivationRepository.deactivate(invitation.invitationId);
      }
      return response;
    } catch (error) {
      this.invitationResponseRepository.remove(invitation.invitationId);
      this.reviewInvitationRepository.update(invitation.invitationId, (row) => {
        row.status = previousStatus;
        row.responseRecordedAt = null;
      });
      this.reviewAssignmentActivationRepository.deactivate(invitation.invitationId);
      throw error;
    }
  }
}

