import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("notification failure keeps committed decision and returns failed notification status", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14g@example.com");
  system.seedPaper({ paperId: "p14-8", editorId: editor.id, completedReviewCount: 1, status: "under_review", decisionPeriodOpen: true });
  system.failNextNotification();

  const response = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-8" },
    body: { outcome: "reject", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.notificationStatus, "failed");
  assert.equal(system.deps.paperDecisionRepository.getPaper("p14-8").status, "rejected");
});
