import { createConflictRecord } from "../../models/conflict-record.js";

export function detectScheduleConflicts({ papers }) {
  const conflicts = [];
  for (const paper of papers) {
    if (paper.blockingConflict === true) {
      conflicts.push(createConflictRecord({
        paperId: paper.paperId,
        code: "BLOCKING_CONFLICT",
        severity: "blocking",
        message: "Paper has unresolved scheduling conflict."
      }));
    }
  }
  return conflicts;
}
