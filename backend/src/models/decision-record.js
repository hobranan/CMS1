import crypto from "node:crypto";

export class PaperDecisionRepository {
  constructor() {
    this.papers = new Map();
    this.decisionsByPaper = new Map();
    this.failNextSave = false;
    this.failNextRead = false;
  }

  seedPaper({
    paperId,
    title = "",
    editorId,
    completedReviewCount = 1,
    decisionPeriodOpen = true,
    status = "under_review",
    authors = [],
    reviewHighlights = [],
    fullReviewContent = null,
    notificationAvailable = true,
    notificationDeliveryStatus = "sent"
  }) {
    this.papers.set(paperId, {
      paperId,
      title,
      editorId,
      completedReviewCount,
      decisionPeriodOpen,
      status,
      authors,
      reviewHighlights,
      fullReviewContent,
      notificationAvailable,
      notificationDeliveryStatus
    });
  }

  getPaper(paperId) {
    if (this.failNextRead) {
      this.failNextRead = false;
      const err = new Error("DECISION_RETRIEVAL_FAILURE");
      err.code = "DECISION_RETRIEVAL_FAILURE";
      throw err;
    }
    return this.papers.get(paperId) ?? null;
  }

  getDecision(paperId) {
    if (this.failNextRead) {
      this.failNextRead = false;
      const err = new Error("DECISION_RETRIEVAL_FAILURE");
      err.code = "DECISION_RETRIEVAL_FAILURE";
      throw err;
    }
    return this.decisionsByPaper.get(paperId) ?? null;
  }

  createDecision({ paperId, editorId, outcome, comment = "", now }) {
    if (this.failNextSave) {
      this.failNextSave = false;
      const err = new Error("DECISION_SAVE_FAILURE");
      err.code = "DECISION_SAVE_FAILURE";
      throw err;
    }

    const paper = this.getPaper(paperId);
    if (!paper) {
      const err = new Error("PAPER_NOT_FOUND");
      err.code = "PAPER_NOT_FOUND";
      throw err;
    }

    const decision = {
      decisionId: crypto.randomUUID(),
      paperId,
      editorId,
      outcome,
      comment,
      decidedAt: now.toISOString()
    };
    this.decisionsByPaper.set(paperId, decision);
    paper.status = outcome === "accept" ? "accepted" : "rejected";
    return decision;
  }

  failNextDecisionSave() {
    this.failNextSave = true;
  }

  failNextDecisionRead() {
    this.failNextRead = true;
  }
}
