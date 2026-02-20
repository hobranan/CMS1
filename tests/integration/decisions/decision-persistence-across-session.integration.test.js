import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("decision remains persisted across subsequent context reads", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14j@example.com");
  system.seedPaper({ paperId: "p14-11", editorId: editor.id, completedReviewCount: 2, status: "under_review", decisionPeriodOpen: true });

  const record = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-11" },
    body: { outcome: "accept", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(record.status, 200);

  const context = system.call("/api/v1/papers/:paperId/decision-context:GET", {
    params: { paperId: "p14-11" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(context.status, 200);
  assert.equal(system.deps.paperDecisionRepository.getPaper("p14-11").status, "accepted");
});
