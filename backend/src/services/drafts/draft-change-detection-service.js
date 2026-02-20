import { computeEditableStateHash } from "../../models/draft-field-state.js";

export function detectDraftChanges(draft, editableState) {
  const nextHash = computeEditableStateHash(editableState);
  const changed = nextHash !== draft.stateHash;
  return { changed, nextHash };
}
