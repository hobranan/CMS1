export function snapshotPaperStatus(paper) {
  return {
    paperId: paper.paperId,
    status: paper.status,
    decisionPeriodOpen: paper.decisionPeriodOpen,
    completedReviewCount: paper.completedReviewCount
  };
}
