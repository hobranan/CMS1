import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("system/network failures keep last successful draft state", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);

  system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Known good title" } }
  });

  system.deps.draftPersistenceService.failNextWith("SYSTEM_FAILURE");
  const systemFailure = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Should not persist 1" } }
  });
  assert.equal(systemFailure.status, 503);

  system.deps.draftPersistenceService.failNextWith("NETWORK_FAILURE");
  const networkFailure = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Should not persist 2" } }
  });
  assert.equal(networkFailure.status, 503);

  const stored = system.deps.submissionDraftRepository.get(draft.id);
  assert.equal(stored.editableState.title, "Known good title");
});

