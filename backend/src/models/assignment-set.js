export function validateAssignmentSet(refereeIds) {
  const ids = Array.isArray(refereeIds) ? refereeIds : [];
  const errors = [];
  if (ids.length < 1) {
    errors.push({
      code: "MIN_REFEREES_REQUIRED",
      field: "referee_ids",
      message: "Select at least one referee."
    });
  }
  if (ids.length > 3) {
    errors.push({
      code: "MAX_REFEREES_EXCEEDED",
      field: "referee_ids",
      message: "Select no more than three referees."
    });
  }
  if (new Set(ids).size !== ids.length) {
    errors.push({
      code: "DUPLICATE_REFEREE",
      field: "referee_ids",
      message: "Duplicate referee selection is not allowed."
    });
  }
  return { valid: errors.length === 0, errors, refereeIds: ids };
}

