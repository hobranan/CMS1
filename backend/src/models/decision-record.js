import crypto from "node:crypto";

export class PaperDecisionRepository {
  constructor() {
    this.papers = new Map();
    this.decisionsByPaper = new Map();
    this.failNextSave = false;
  }

  seedPaper({ paperId, title = "", editorId, completedReviewCount = 1, decisionPeriodOpen = true, status = "under_review", authors = [] }) {
    this.papers.set(paperId, {
      paperId,
      title,
      editorId,
      completedReviewCount,
      decisionPeriodOpen,
      status,
      authors
    });
  }

  getPaper(paperId) {
    return this.papers.get(paperId) ?? null;
  }

  getDecision(paperId) {
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
}
