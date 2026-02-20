import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("save failure returns 500 and leaves status unchanged", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14f@example.com");
  system.seedPaper({ paperId: "p14-7", editorId: editor.id, completedReviewCount: 1, status: "under_review", decisionPeriodOpen: true });
  system.failNextSave();

  const response = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-7" },
    body: { outcome: "accept", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 500);
  assert.equal(system.deps.paperDecisionRepository.getPaper("p14-7").status, "under_review");
});
