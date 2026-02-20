import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("delivery failure still shows CMS decision as source of truth", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-10@example.com");
  const editor = system.addEditor("e15-10@example.com");
  system.seedPaper({ paperId: "p15-10", editorId: editor.id, authors: [author.id], notificationDeliveryStatus: "failed", completedReviewCount: 1 });
  system.recordDecision({ paperId: "p15-10", editorId: editor.id, outcome: "accept", comment: "Available in CMS" });

  const response = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-10" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.deliveryStatus, "failed");
  assert.equal(response.body.sourceOfTruth, "cms");
});
