import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("save draft success returns SAVED", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);
  const result = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Draft title" } }
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.status, "SAVED");
});
