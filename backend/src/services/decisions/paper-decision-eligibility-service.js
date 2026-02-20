import { evaluateDecisionEligibility } from "../../models/paper-decision-eligibility.js";

export function validateDecisionEligibility(repository, { paperId, editorId, allowNoReviewsOverride = false }) {
  const paper = repository.getPaper(paperId);
  const eligibility = evaluateDecisionEligibility({ paper, editorId, allowNoReviewsOverride });
  return { paper, ...eligibility };
}
