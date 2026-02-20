export function createGetDraftController(deps) {
  return {
    get: (request) => {
      const draftId = request.params?.draftId;
      if (!request.user?.email) {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication is required." } };
      }
      const draft = deps.submissionDraftRepository.get(draftId);
      if (!draft || draft.authorEmail !== request.user.email) {
        return { status: 404, body: { code: "DRAFT_NOT_FOUND", message: "Draft not found." } };
      }
      return {
        status: 200,
        body: {
          draft_id: draft.id,
          status: draft.status,
          editable_state: draft.editableState,
          last_saved_at: draft.lastSavedAt
        }
      };
    }
  };
}
