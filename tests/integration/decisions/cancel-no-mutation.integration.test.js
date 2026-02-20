import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("cancel before confirm does not mutate paper status", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14i@example.com");
  system.seedPaper({ paperId: "p14-10", editorId: editor.id, completedReviewCount: 2, status: "under_review", decisionPeriodOpen: true });

  const response = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-10" },
    body: { outcome: "accept", confirm: false },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.equal(system.deps.paperDecisionRepository.getPaper("p14-10").status, "under_review");
});
