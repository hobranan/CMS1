export function saveDraft(apiClient, draftId, editableState, user) {
  return apiClient("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId },
    user,
    body: { editable_state: editableState }
  });
}

export function submitDraft(apiClient, draftId, editableState, user) {
  return apiClient("/api/v1/drafts/:draftId/finalize:POST", {
    params: { draftId },
    user,
    body: { editable_state: editableState }
  });
}
