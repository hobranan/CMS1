export class ReviewInvitationService {
  constructor() {
    this.failNext = false;
    this.sentInvitations = [];
  }

  failNextDispatch() {
    this.failNext = true;
  }

  sendInvitations({ paperId, refereeIds }) {
    if (this.failNext) {
      this.failNext = false;
      const error = new Error("INVITATION_FAILURE");
      error.code = "INVITATION_FAILURE";
      throw error;
    }
    for (const refereeId of refereeIds) {
      this.sentInvitations.push({ paperId, refereeId });
    }
  }
}

