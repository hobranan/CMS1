import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("decision-context returns decision prerequisites", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14a@example.com");
  system.seedPaper({ paperId: "p14-1", editorId: editor.id, completedReviewCount: 2, status: "under_review", decisionPeriodOpen: true });

  const response = system.call("/api/v1/papers/:paperId/decision-context:GET", {
    params: { paperId: "p14-1" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.completedReviewCount, 2);
});
