export function persistScheduleDraft(repository, payload) {
  try {
    const draft = repository.createDraft(payload);
    return { ok: true, draft };
  } catch {
    return {
      ok: false,
      status: 500,
      body: { code: "SCHEDULE_SAVE_FAILURE", message: "Schedule draft could not be saved." }
    };
  }
}
