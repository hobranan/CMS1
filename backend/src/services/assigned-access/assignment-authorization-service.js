export function isAssignedToPaper(assignedPaperRepository, refereeId, paperId) {
  const list = assignedPaperRepository.listAssigned(refereeId);
  return list.some((paper) => paper.paperId === paperId && paper.assignmentStatus === "active");
}

