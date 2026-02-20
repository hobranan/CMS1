export class ReviewAssignmentActivationRepository {
  constructor() {
    this.activeAssignments = new Map();
  }

  activate({ invitationId, paperId, refereeId, now }) {
    this.activeAssignments.set(invitationId, {
      invitationId,
      paperId,
      refereeId,
      activeAt: now.toISOString()
    });
  }

  deactivate(invitationId) {
    this.activeAssignments.delete(invitationId);
  }

  isActive(invitationId) {
    return this.activeAssignments.has(invitationId);
  }
}

