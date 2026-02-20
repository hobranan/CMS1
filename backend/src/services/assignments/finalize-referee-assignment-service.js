import { executeAssignmentTransaction } from "./referee-assignment-transaction-service.js";
import { validateAssignmentVersion } from "./referee-assignment-concurrency-service.js";
import { validateRefereeEligibility } from "./referee-eligibility-validation-service.js";
import { validateSelectionRules } from "./referee-selection-rule-service.js";

export function finalizeRefereeAssignment(deps, { paperId, refereeIds, expectedVersion }) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const paper = deps.paperRefereeAssignmentRepository.getPaper(paperId);
  if (!paper) {
    return {
      status: 404,
      body: {
        code: "PAPER_NOT_ASSIGNABLE",
        message: "Paper not found."
      }
    };
  }

  const concurrency = validateAssignmentVersion(paper, expectedVersion);
  if (!concurrency.valid) {
    return {
      status: 409,
      body: {
        code: concurrency.code,
        message: concurrency.message
      }
    };
  }

  const selection = validateSelectionRules(refereeIds);
  if (!selection.valid) {
    return {
      status: 400,
      body: {
        code: "ASSIGNMENT_VALIDATION_FAILED",
        message: "Invalid referee selection.",
        errors: selection.errors
      }
    };
  }

  const eligibility = validateRefereeEligibility(deps.paperRefereeAssignmentRepository, selection.refereeIds);
  if (!eligibility.valid) {
    return {
      status: 400,
      body: {
        code: "ASSIGNMENT_VALIDATION_FAILED",
        message: "Selected referees are not valid for assignment.",
        errors: eligibility.errors
      }
    };
  }

  const transaction = executeAssignmentTransaction({
    assignmentRepository: deps.paperRefereeAssignmentRepository,
    invitationService: deps.reviewInvitationService,
    paperId,
    refereeIds: selection.refereeIds,
    now
  });

  deps.assignmentObservabilityService?.record("assignment_confirmation", {
    paperId,
    ok: transaction.ok,
    refereeCount: selection.refereeIds.length
  });

  if (!transaction.ok) {
    return {
      status: 503,
      body: {
        code: transaction.code,
        message: transaction.message
      }
    };
  }

  return {
    status: 200,
    body: {
      status: "ASSIGNMENT_FINALIZED",
      paper_id: paperId,
      assigned_referee_ids: selection.refereeIds
    }
  };
}
