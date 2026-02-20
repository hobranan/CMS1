import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("finalize returns 409 and keeps prevalidation save when final validation fails", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);

  const result = system.call("/api/v1/drafts/:draftId/finalize:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: {
      editable_state: {
        title: "Saved before final validation",
        abstract: ""
      }
    }
  });

  assert.equal(result.status, 409);
  assert.equal(result.body.code, "FINAL_VALIDATION_FAILED");
  assert.equal(result.body.draft_saved, true);

  const stored = system.deps.submissionDraftRepository.get(draft.id);
  assert.equal(stored.editableState.title, "Saved before final validation");
  assert.equal(stored.status, "DRAFT");
});

