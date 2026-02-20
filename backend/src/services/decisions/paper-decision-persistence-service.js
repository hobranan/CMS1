import { snapshotPaperStatus } from "../../models/paper-status-snapshot.js";

export function persistPaperDecision(repository, { paperId, editorId, outcome, comment, now }) {
  const before = snapshotPaperStatus(repository.getPaper(paperId));
  try {
    const decision = repository.createDecision({ paperId, editorId, outcome, comment, now });
    return { ok: true, decision };
  } catch (error) {
    const paper = repository.getPaper(paperId);
    if (paper) {
      paper.status = before.status;
    }
    return {
      ok: false,
      status: 500,
      code: error.code ?? "DECISION_SAVE_FAILURE",
      message: "Paper decision could not be saved."
    };
  }
}
