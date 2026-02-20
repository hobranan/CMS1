import { markAssignmentCompleted } from "./review-assignment-status-service.js";
import { persistReviewSubmission } from "./review-submission-persistence-service.js";
import { validateReviewSubmission } from "./review-submission-validation-service.js";

export function processReviewSubmission(deps, { assignmentId, refereeId, fields, recommendation, comments }) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const assignment = deps.reviewSubmissionRepository.getAssignment(assignmentId);
  if (!assignment || assignment.refereeId !== refereeId) {
    return {
      status: 403,
      body: { code: "ASSIGNMENT_INACTIVE", message: "Assignment is not active." }
    };
  }

  const validation = validateReviewSubmission({ assignment, fields, recommendation });
  if (!validation.ok) {
    deps.reviewSubmissionObservabilityService?.record("review_submission_rejected", {
      assignmentId,
      reason: validation.code
    });
    return {
      status: validation.status,
      body: {
        code: validation.code,
        message: validation.message,
        errors: validation.errors
      }
    };
  }

  let submitted;
  try {
    submitted = persistReviewSubmission(deps.reviewSubmissionRepository, {
      assignmentId,
      refereeId,
      fields,
      recommendation,
      comments,
      now
    });
    markAssignmentCompleted(deps.reviewSubmissionRepository, assignmentId);
  } catch {
    deps.reviewSubmissionObservabilityService?.record("review_submission_failure", {
      assignmentId,
      reason: "REVIEW_DB_FAILURE"
    });
    return {
      status: 500,
      body: {
        code: "REVIEW_DB_FAILURE",
        message: "Review submission could not be persisted."
      }
    };
  }

  let notificationStatus = "sent";
  try {
    deps.reviewNotificationService.notifyEditor(submitted);
  } catch {
    notificationStatus = "failed";
  }

  deps.reviewSubmissionObservabilityService?.record("review_submitted", {
    assignmentId,
    reviewId: submitted.reviewId,
    versionNumber: submitted.versionNumber,
    notificationStatus
  });

  return {
    status: 200,
    body: {
      reviewId: submitted.reviewId,
      status: "submitted",
      versionNumber: submitted.versionNumber,
      assignmentStatus: "completed",
      previousReviewId: submitted.previousReviewId,
      notificationStatus
    }
  };
}

