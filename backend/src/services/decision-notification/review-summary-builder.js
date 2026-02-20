export function buildReviewSummary(decision, paper) {
  const bullets = [];
  bullets.push(`Decision outcome: ${decision.outcome}`);
  if (decision.comment) {
    bullets.push(`Editor summary note: ${decision.comment}`);
  }
  if (paper.reviewHighlights && paper.reviewHighlights.length > 0) {
    bullets.push(...paper.reviewHighlights);
  }
  return bullets;
}
