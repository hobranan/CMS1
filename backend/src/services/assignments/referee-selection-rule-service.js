import { validateAssignmentSet } from "../../models/assignment-set.js";

export function validateSelectionRules(refereeIds) {
  return validateAssignmentSet(refereeIds);
}

