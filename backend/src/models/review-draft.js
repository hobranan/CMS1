import crypto from "node:crypto";

export class ReviewSubmissionRepository {
  constructor() {
    this.assignments = new Map();
    this.drafts = new Map();
    this.submittedByAssignment = new Map();
    this.submittedById = new Map();
    this.versionLinks = [];
    this.failNextWrite = false;
    this.failNextRead = false;
  }

  seedAssignment({ assignmentId, refereeId, editorId = "editor-1", paperId = null, status = "active", deadlineIndicator = null }) {
    this.assignments.set(assignmentId, {
      assignmentId,
      refereeId,
      editorId,
      paperId,
      status,
      deadlineIndicator
    });
  }

  seedDraft({ assignmentId, requiredFields = {}, recommendation = "", comments = "" }) {
    this.drafts.set(assignmentId, {
      assignmentId,
      requiredFields,
      recommendation,
      comments,
      deadlineEnforced: false
    });
  }

  getAssignment(assignmentId) {
    return this.assignments.get(assignmentId) ?? null;
  }

  listAssignmentsByPaper(paperId) {
    const result = [];
    for (const assignment of this.assignments.values()) {
      if (assignment.paperId === paperId) {
        result.push(assignment);
      }
    }
    return result;
  }

  getDraft(assignmentId) {
    return this.drafts.get(assignmentId) ?? null;
  }

  updateAssignmentStatus(assignmentId, status) {
    const assignment = this.getAssignment(assignmentId);
    if (!assignment) return null;
    assignment.status = status;
    return assignment;
  }

  getLatestSubmitted(assignmentId) {
    const list = this.submittedByAssignment.get(assignmentId) ?? [];
    return list.length > 0 ? list[list.length - 1] : null;
  }

  createSubmittedReview({ assignmentId, refereeId, fields, recommendation, comments, now }) {
    if (this.failNextWrite) {
      this.failNextWrite = false;
      const err = new Error("REVIEW_DB_FAILURE");
      err.code = "REVIEW_DB_FAILURE";
      throw err;
    }

    const latest = this.getLatestSubmitted(assignmentId);
    const versionNumber = latest ? latest.versionNumber + 1 : 1;
    const reviewId = crypto.randomUUID();
    const submitted = {
      reviewId,
      assignmentId,
      refereeId,
      fields: { ...fields },
      recommendation,
      comments: comments ?? "",
      status: "submitted",
      versionNumber,
      previousReviewId: latest ? latest.reviewId : null,
      submittedAt: now.toISOString()
    };

    const list = this.submittedByAssignment.get(assignmentId) ?? [];
    list.push(submitted);
    this.submittedByAssignment.set(assignmentId, list);
    this.submittedById.set(reviewId, submitted);
    if (latest) {
      this.versionLinks.push({
        assignmentId,
        previousReviewId: latest.reviewId,
        nextReviewId: reviewId
      });
    }
    return submitted;
  }

  getSubmittedReview(reviewId) {
    if (this.failNextRead) {
      this.failNextRead = false;
      const err = new Error("REVIEW_DB_READ_FAILURE");
      err.code = "REVIEW_DB_READ_FAILURE";
      throw err;
    }
    return this.submittedById.get(reviewId) ?? null;
  }

  listSubmittedForEditor(editorId) {
    const result = [];
    for (const assignment of this.assignments.values()) {
      if (assignment.editorId !== editorId) continue;
      const list = this.submittedByAssignment.get(assignment.assignmentId) ?? [];
      result.push(...list);
    }
    return result;
  }

  listSubmittedForAssignment(assignmentId) {
    if (this.failNextRead) {
      this.failNextRead = false;
      const err = new Error("REVIEW_DB_READ_FAILURE");
      err.code = "REVIEW_DB_READ_FAILURE";
      throw err;
    }
    return [...(this.submittedByAssignment.get(assignmentId) ?? [])];
  }

  failNextSubmissionWrite() {
    this.failNextWrite = true;
  }

  failNextSubmissionRead() {
    this.failNextRead = true;
  }
}
