import { authorizeEditorReviewAccess } from "./editor-review-authorization-service.js";
import { asCompletedReviewRecord } from "../../models/completed-review-record.js";
import { projectAnonymizedDetail } from "./anonymized-review-projection-service.js";

export function getCompletedReviewDetail(deps, { editorId, paperId, reviewId }) {
  try {
    const auth = authorizeEditorReviewAccess(deps.reviewSubmissionRepository, editorId, reviewId);
    if (!auth.ok) {
      return { outcome: auth.code };
    }
    if (auth.assignment.paperId !== paperId) {
      return { outcome: "review_not_found" };
    }
    const record = asCompletedReviewRecord(auth.review, auth.assignment);
    if (!record) {
      return { outcome: "review_not_found" };
    }
    return { outcome: "ok", review: projectAnonymizedDetail(record) };
  } catch {
    return { outcome: "retrieval_error" };
  }
}


