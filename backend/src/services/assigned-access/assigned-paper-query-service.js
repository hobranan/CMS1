export function queryAssignedPapers(assignedPaperRepository, refereeId) {
  return assignedPaperRepository.listAssigned(refereeId).filter((paper) => paper.assignmentStatus === "active");
}

