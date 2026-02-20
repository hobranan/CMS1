import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("reject decision persists and updates paper status", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14c@example.com");
  system.seedPaper({ paperId: "p14-3", editorId: editor.id, completedReviewCount: 3, status: "under_review", decisionPeriodOpen: true });

  const response = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-3" },
    body: { outcome: "reject", comment: "Not ready", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.outcome, "reject");
  assert.equal(system.deps.paperDecisionRepository.getPaper("p14-3").status, "rejected");
});
