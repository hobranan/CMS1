import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("save returns SYSTEM_FAILURE when persistence fails", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);
  system.deps.draftPersistenceService.failNextWith("SYSTEM_FAILURE");

  const result = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Title before failure" } }
  });

  assert.equal(result.status, 503);
  assert.equal(result.body.code, "SYSTEM_FAILURE");
});

test("save returns NETWORK_FAILURE when connectivity fails", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);
  system.deps.draftPersistenceService.failNextWith("NETWORK_FAILURE");

  const result = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: { editable_state: { title: "Title before network failure" } }
  });

  assert.equal(result.status, 503);
  assert.equal(result.body.code, "NETWORK_FAILURE");
});

