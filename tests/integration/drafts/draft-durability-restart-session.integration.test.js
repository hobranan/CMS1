import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("draft survives backend route rebuild and session boundary", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);

  const saved = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Durable title", abstract: "Durable abstract" } }
  });
  assert.equal(saved.status, 200);

  system.restartBackend();

  const fetched = system.call("/api/v1/drafts/:draftId:GET", {
    params: { draftId: draft.id },
    user: { email }
  });
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.editable_state.title, "Durable title");
  assert.equal(fetched.body.editable_state.abstract, "Durable abstract");
});

