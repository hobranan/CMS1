import test from "node:test";
import assert from "node:assert/strict";
import { createUc07System } from "../../helpers/uc07_system.js";

test("finalize records prevalidation save before final validation", () => {
  const system = createUc07System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraft(email);

  const result = system.call("/api/v1/drafts/:draftId/finalize:POST", {
    params: { draftId: draft.id },
    user: { email },
    body: {
      editable_state: {
        title: "Saved first",
        abstract: ""
      }
    }
  });

  assert.equal(result.status, 409);
  const events = system.deps.finalizeOrderingObservabilityService.events.map((entry) => entry.event);
  assert.deepEqual(events, [
    "finalize_prevalidation_save_start",
    "finalize_prevalidation_save_end",
    "finalize_final_validation"
  ]);
});

