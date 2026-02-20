export class RefereeWorkloadRetrievalService {
  constructor() {
    this.failNext = false;
    this.workloads = new Map();
  }

  seed(refereeId, count) {
    this.workloads.set(refereeId, count);
  }

  failNextRead() {
    this.failNext = true;
  }

  getCurrentWorkload(refereeId) {
    if (this.failNext) {
      this.failNext = false;
      const error = new Error("WORKLOAD_RETRIEVAL_FAILURE");
      error.code = "WORKLOAD_RETRIEVAL_FAILURE";
      throw error;
    }
    return this.workloads.get(refereeId) ?? 0;
  }

  increment(refereeId) {
    const current = this.workloads.get(refereeId) ?? 0;
    this.workloads.set(refereeId, current + 1);
  }
}
