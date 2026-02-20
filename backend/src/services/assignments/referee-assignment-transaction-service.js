import {
  assignmentTransactionFailure,
  assignmentTransactionSuccess
} from "../../models/assignment-transaction-result.js";

export function executeAssignmentTransaction({
  assignmentRepository,
  invitationService,
  paperId,
  refereeIds,
  now
}) {
  let previousAssignment;
  try {
    previousAssignment = assignmentRepository.applyAssignment({
      paperId,
      refereeIds,
      now
    });
  } catch {
    return assignmentTransactionFailure(
      "ASSIGNMENT_PERSISTENCE_FAILURE",
      "Assignment could not be saved."
    );
  }

  try {
    invitationService.sendInvitations({ paperId, refereeIds });
  } catch {
    assignmentRepository.restoreAssignment({ paperId, previousAssignment, now });
    return assignmentTransactionFailure(
      "ASSIGNMENT_INVITATION_FAILURE",
      "Invitations failed; assignment rollback completed."
    );
  }

  return assignmentTransactionSuccess(paperId, refereeIds);
}

