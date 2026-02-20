import { asCompletedReviewRecord } from "../../models/completed-review-record.js";

export function listCompletedReviewsForPaper(repository, paperId) {
  const assignments = repository.listAssignmentsByPaper(paperId);
  const output = [];
  for (const assignment of assignments) {
    const submitted = repository.listSubmittedForAssignment(assignment.assignmentId);
    for (const review of submitted) {
      const record = asCompletedReviewRecord(review, assignment);
      if (record) output.push(record);
    }
  }
  return output;
}
