export class AssignedPaperRepository {
  constructor() {
    this.assignedByReferee = new Map();
    this.manuscriptsByPaper = new Map();
    this.reviewFormsByPaper = new Map();
    this.failNextList = false;
    this.failNextResource = false;
  }

  seedAssignment({ refereeId, paperId, title, assignmentStatus = "active" }) {
    const list = this.assignedByReferee.get(refereeId) ?? [];
    list.push({ paperId, title, assignmentStatus });
    this.assignedByReferee.set(refereeId, list);
  }

  seedManuscript({ paperId, contentUrl }) {
    this.manuscriptsByPaper.set(paperId, { paperId, contentUrl, accessMode: "view_only" });
  }

  seedReviewForm({ paperId, reviewFormId, preGenerated = true }) {
    this.reviewFormsByPaper.set(paperId, { paperId, reviewFormId, preGenerated });
  }

  listAssigned(refereeId) {
    if (this.failNextList) {
      this.failNextList = false;
      const err = new Error("ASSIGNED_LIST_FAILURE");
      err.code = "ASSIGNED_LIST_FAILURE";
      throw err;
    }
    return this.assignedByReferee.get(refereeId) ?? [];
  }

  getManuscript(paperId) {
    if (this.failNextResource) {
      this.failNextResource = false;
      const err = new Error("RESOURCE_RETRIEVAL_FAILURE");
      err.code = "RESOURCE_RETRIEVAL_FAILURE";
      throw err;
    }
    return this.manuscriptsByPaper.get(paperId) ?? null;
  }

  getReviewForm(paperId) {
    if (this.failNextResource) {
      this.failNextResource = false;
      const err = new Error("RESOURCE_RETRIEVAL_FAILURE");
      err.code = "RESOURCE_RETRIEVAL_FAILURE";
      throw err;
    }
    return this.reviewFormsByPaper.get(paperId) ?? null;
  }

  failNextListRead() {
    this.failNextList = true;
  }

  failNextResourceRead() {
    this.failNextResource = true;
  }
}

