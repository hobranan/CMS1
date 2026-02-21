import { DecisionRetrievalError } from "../errors/decision-retrieval-error.js";
import { DECISION_STATES, isFinalDecision } from "../../models/decision-state.js";

export function getDecisionWithFailureHandling(repository, paperId) {
  try {
    const paper = repository.paperDecisionRepository.getPaper(paperId);
    if (!paper) {
      throw new DecisionRetrievalError("PAPER_NOT_FOUND", "Paper not found.");
    }
    const decision = repository.getDecisionForPaper(paperId);
    if (!decision) {
      return { paper, decisionStatus: DECISION_STATES.UNDER_REVIEW, decision: null };
    }
    const finalStatus = decision.outcome === "accept"
      ? DECISION_STATES.ACCEPTED
      : decision.outcome === "reject"
        ? DECISION_STATES.REJECTED
        : DECISION_STATES.UNDER_REVIEW;
    if (!isFinalDecision(finalStatus)) {
      return { paper, decisionStatus: DECISION_STATES.UNDER_REVIEW, decision: null };
    }
    return { paper, decisionStatus: finalStatus, decision };
  } catch (error) {
    if (error.code) throw error;
    throw new DecisionRetrievalError();
  }
}
