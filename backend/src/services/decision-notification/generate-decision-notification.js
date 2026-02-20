import { buildReviewSummary } from "./review-summary-builder.js";
import { buildFullReviewSection } from "./full-review-section-builder.js";
import { composeNotificationBody } from "./notification-body-composer.js";

export function generateDecisionNotification({ paper, decision, decisionStatus, deliveryStatus }) {
  const summaryBullets = buildReviewSummary(decision, paper);
  const fullReview = buildFullReviewSection(paper);
  const body = composeNotificationBody({
    decisionStatus,
    summaryBullets,
    fullReviewContent: fullReview.content
  });

  return {
    paperId: paper.paperId,
    decisionStatus,
    summaryBullets: body.summaryBullets,
    fullReviewContent: body.fullReviewContent,
    fullReviewAvailable: fullReview.available,
    sectionOrder: body.sectionOrder,
    deliveryStatus
  };
}
