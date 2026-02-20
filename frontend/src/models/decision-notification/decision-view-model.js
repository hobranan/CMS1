export function toDecisionViewModel(response) {
  return {
    paperId: response.body.paperId,
    decisionStatus: response.body.decisionStatus,
    decisionComment: response.body.decisionComment ?? null,
    sourceOfTruth: response.body.sourceOfTruth ?? "cms",
    deliveryStatus: response.body.deliveryStatus ?? "sent"
  };
}
