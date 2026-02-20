import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("saved draft is retrievable after simulated logout/login", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);

  system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Session persisted title", abstract: "A1" } }
  });

  const result = system.call("/api/v1/drafts/:draftId:GET", {
    params: { draftId: draft.id },
    user: { email }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.editable_state.title, "Session persisted title");
  assert.equal(result.body.editable_state.abstract, "A1");
});

