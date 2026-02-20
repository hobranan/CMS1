import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("save with invalid editable values returns VALIDATION_FAILED", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);

  const result = system.call("/api/v1/drafts/:draftId/save:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: {
      editable_state: {
        title: "ab",
        contact_email: "not-an-email"
      }
    }
  });

  assert.equal(result.status, 400);
  assert.equal(result.body.status, "VALIDATION_FAILED");
  assert.ok(Array.isArray(result.body.errors));
  assert.ok(result.body.errors.length >= 1);
});

