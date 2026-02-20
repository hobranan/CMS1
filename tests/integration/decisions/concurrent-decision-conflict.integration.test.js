import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("second near-simultaneous decision attempt returns conflict", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14k@example.com");
  system.seedPaper({ paperId: "p14-12", editorId: editor.id, completedReviewCount: 2, status: "under_review", decisionPeriodOpen: true });

  const first = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-12" },
    body: { outcome: "reject", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(first.status, 200);

  const second = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-12" },
    body: { outcome: "accept", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(second.status, 409);
});
