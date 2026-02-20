export class PaperRefereeAssignmentRepository {
  constructor() {
    this.papers = new Map();
    this.assignments = new Map();
    this.referees = new Map();
  }

  seedPaper({ paperId, status = "SUBMITTED", version = 0 }) {
    this.papers.set(paperId, { id: paperId, status, version });
  }

  seedReferee({ refereeId, eligible = true, currentLoad = 0, maxLoad = 3 }) {
    this.referees.set(refereeId, { refereeId, eligible, currentLoad, maxLoad });
  }

  getPaper(paperId) {
    return this.papers.get(paperId) ?? null;
  }

  getReferee(refereeId) {
    return this.referees.get(refereeId) ?? null;
  }

  getAssignment(paperId) {
    return this.assignments.get(paperId) ?? { paperId, refereeIds: [] };
  }

  applyAssignment({ paperId, refereeIds, now }) {
    const previous = this.getAssignment(paperId);
    const previousIds = previous.refereeIds ?? [];

    for (const id of previousIds) {
      const ref = this.getReferee(id);
      if (ref) {
        ref.currentLoad = Math.max(0, ref.currentLoad - 1);
      }
    }
    for (const id of refereeIds) {
      const ref = this.getReferee(id);
      if (ref) {
        ref.currentLoad += 1;
      }
    }

    this.assignments.set(paperId, {
      paperId,
      refereeIds: [...refereeIds],
      assignedAt: now.toISOString()
    });
    const paper = this.getPaper(paperId);
    if (paper) {
      paper.status = "ASSIGNED";
      paper.version += 1;
    }
    return previous;
  }

  restoreAssignment({ paperId, previousAssignment, now }) {
    const current = this.getAssignment(paperId);
    for (const id of current.refereeIds ?? []) {
      const ref = this.getReferee(id);
      if (ref) {
        ref.currentLoad = Math.max(0, ref.currentLoad - 1);
      }
    }
    for (const id of previousAssignment.refereeIds ?? []) {
      const ref = this.getReferee(id);
      if (ref) {
        ref.currentLoad += 1;
      }
    }
    this.assignments.set(paperId, {
      paperId,
      refereeIds: [...(previousAssignment.refereeIds ?? [])],
      assignedAt: previousAssignment.assignedAt ?? now.toISOString()
    });
    const paper = this.getPaper(paperId);
    if (paper) {
      paper.status = (previousAssignment.refereeIds ?? []).length > 0 ? "ASSIGNED" : "SUBMITTED";
      paper.version += 1;
    }
  }
}

