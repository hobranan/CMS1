export function composeNotificationBody({ decisionStatus, summaryBullets, fullReviewContent }) {
  return {
    decisionHeader: `Final decision: ${decisionStatus}`,
    summaryBullets,
    fullReviewContent,
    sectionOrder: ["decision_header", "summary_bullets", "full_review"]
  };
}
