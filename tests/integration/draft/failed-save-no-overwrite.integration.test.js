import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("validation failure does not overwrite last persisted draft", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);

  const saved = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Stable saved title", abstract: "A1" } }
  });
  assert.equal(saved.status, 200);

  const failed = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: {
      editable_state: {
        title: "x",
        contact_email: "bad-email"
      }
    }
  });
  assert.equal(failed.status, 400);

  const stored = system.deps.submissionDraftRepository.get(draft.id);
  assert.equal(stored.editableState.title, "Stable saved title");
  assert.equal(stored.editableState.abstract, "A1");
});

