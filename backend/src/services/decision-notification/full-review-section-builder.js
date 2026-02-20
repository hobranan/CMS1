export function buildFullReviewSection(paper) {
  if (!paper.fullReviewContent) {
    return { content: null, available: false };
  }
  return { content: paper.fullReviewContent, available: true };
}
