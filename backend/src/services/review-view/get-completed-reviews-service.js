import { authorizeEditorPaperAccess } from "./editor-review-authorization-service.js";
import { listCompletedReviewsForPaper } from "./completed-review-query-service.js";
import { projectAnonymizedList } from "./anonymized-review-projection-service.js";

export function getCompletedReviews(deps, { editorId, paperId }) {
  const auth = authorizeEditorPaperAccess(deps.reviewSubmissionRepository, editorId, paperId);
  if (!auth.ok) {
    return { outcome: "unauthorized" };
  }
  try {
    const records = listCompletedReviewsForPaper(deps.reviewSubmissionRepository, paperId);
    if (records.length === 0) {
      return { outcome: "none_available" };
    }
    return { outcome: "ok", reviews: projectAnonymizedList(records) };
  } catch {
    return { outcome: "retrieval_error" };
  }
}
