import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("notification failure payload includes preserved status and redacted fields", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14h@example.com");
  system.seedPaper({ paperId: "p14-9", editorId: editor.id, completedReviewCount: 1, status: "under_review", decisionPeriodOpen: true });
  system.failNextNotification();

  const response = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-9" },
    body: { outcome: "accept", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "accepted");
  assert.equal(response.body.notificationStatus, "failed");
  assert.equal(response.body.editorId, undefined);
});
