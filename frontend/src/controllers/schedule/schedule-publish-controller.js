export function publishScheduleDraft(apiClient, conferenceId, draftId, payload, user) {
  return apiClient("/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST", {
    params: { conferenceId, draftId },
    body: payload,
    user
  });
}
