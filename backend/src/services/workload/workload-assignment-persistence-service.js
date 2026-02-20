export class WorkloadAssignmentPersistenceService {
  constructor() {
    this.failNext = false;
    this.paperAssignments = new Map();
  }

  failNextWrite() {
    this.failNext = true;
  }

  persist({ paperId, refereeId }) {
    if (this.failNext) {
      this.failNext = false;
      const error = new Error("WORKLOAD_STORAGE_FAILURE");
      error.code = "WORKLOAD_STORAGE_FAILURE";
      throw error;
    }

    const existing = this.paperAssignments.get(paperId) ?? [];
    if (!existing.includes(refereeId)) {
      this.paperAssignments.set(paperId, [...existing, refereeId]);
    }
    return this.paperAssignments.get(paperId);
  }

  getAssignmentsForPaper(paperId) {
    return this.paperAssignments.get(paperId) ?? [];
  }
}

