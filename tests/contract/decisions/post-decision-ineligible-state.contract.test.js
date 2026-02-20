import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("already decided and closed period return ineligible responses", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14e@example.com");
  system.seedPaper({ paperId: "p14-5", editorId: editor.id, completedReviewCount: 1, status: "accepted", decisionPeriodOpen: true });

  const decided = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-5" },
    body: { outcome: "reject", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(decided.status, 409);

  system.seedPaper({ paperId: "p14-6", editorId: editor.id, completedReviewCount: 1, status: "under_review", decisionPeriodOpen: false });
  const closed = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-6" },
    body: { outcome: "accept", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(closed.status, 403);
});
