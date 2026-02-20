export class DecisionRetrievalError extends Error {
  constructor(code = "DECISION_RETRIEVAL_FAILURE", message = "Decision details are temporarily unavailable.") {
    super(message);
    this.code = code;
  }
}
