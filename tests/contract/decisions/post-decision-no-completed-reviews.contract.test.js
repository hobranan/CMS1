import test from "node:test";
import assert from "node:assert/strict";
import { createUc14System } from "../../helpers/uc14_system.js";

test("no completed reviews blocks decision unless override is used", () => {
  const system = createUc14System();
  const editor = system.addEditor("ed14d@example.com");
  system.seedPaper({ paperId: "p14-4", editorId: editor.id, completedReviewCount: 0, status: "under_review", decisionPeriodOpen: true });

  const blocked = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-4" },
    body: { outcome: "accept", confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(blocked.status, 403);

  const override = system.call("/api/v1/papers/:paperId/decision:POST", {
    params: { paperId: "p14-4" },
    body: { outcome: "accept", confirm: true, allowNoReviewsOverride: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(override.status, 200);
});
