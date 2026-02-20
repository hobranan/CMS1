import { asViewOnlyManuscript } from "../../models/manuscript-view-resource.js";
import { asPreGeneratedReviewForm } from "../../models/review-form-access.js";

export function getAssignedManuscript(assignedPaperRepository, paperId) {
  try {
    const manuscript = assignedPaperRepository.getManuscript(paperId);
    if (!manuscript) {
      return { ok: false, status: 404, code: "MANUSCRIPT_UNAVAILABLE", message: "Manuscript is unavailable." };
    }
    return { ok: true, value: asViewOnlyManuscript(manuscript) };
  } catch {
    return { ok: false, status: 500, code: "RESOURCE_SYSTEM_ERROR", message: "Resource retrieval failed." };
  }
}

export function getAssignedReviewForm(assignedPaperRepository, paperId) {
  try {
    const form = assignedPaperRepository.getReviewForm(paperId);
    if (!form) {
      return { ok: false, status: 404, code: "REVIEW_FORM_UNAVAILABLE", message: "Review form is unavailable." };
    }
    return { ok: true, value: asPreGeneratedReviewForm(form) };
  } catch {
    return { ok: false, status: 500, code: "RESOURCE_SYSTEM_ERROR", message: "Resource retrieval failed." };
  }
}

