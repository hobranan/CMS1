import { asConflictValidationResult } from "../../models/conflict-validation-result.js";

export function validateScheduleEdits({ draft, editPayload }) {
  const issues = [];
  if (!Array.isArray(editPayload?.placements)) {
    issues.push({ code: "INVALID_REFERENCE", message: "Placements payload is required." });
  }
  if (Array.isArray(editPayload?.placements)) {
    for (const p of editPayload.placements) {
      if (!p.paperId || p.slotIndex === undefined || !p.roomId) {
        issues.push({ code: "INVALID_REFERENCE", message: "Placement reference is incomplete." });
        break;
      }
    }
  }
  if (Array.isArray(editPayload?.conflicts) && editPayload.conflicts.some((c) => c.severity === "blocking")) {
    issues.push({ code: "SAVE_CONFLICT", message: "Blocking conflicts must be resolved before save." });
  }
  return asConflictValidationResult({ valid: issues.length === 0, issues });
}
