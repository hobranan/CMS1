export function mapPaperDecisionNotificationFailure(responseBody) {
  return {
    ...responseBody,
    notificationMessage: "Decision saved, but notifying authors failed."
  };
}
