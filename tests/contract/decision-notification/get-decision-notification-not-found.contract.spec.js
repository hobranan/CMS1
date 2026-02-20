import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("missing notification returns 404", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-5@example.com");
  const editor = system.addEditor("e15-5@example.com");
  system.seedPaper({ paperId: "p15-5", editorId: editor.id, authors: [author.id], notificationAvailable: false, completedReviewCount: 1 });
  system.recordDecision({ paperId: "p15-5", editorId: editor.id, outcome: "accept", comment: "OK" });

  const response = system.call("/api/v1/author/papers/:paperId/decision-notification:GET", {
    params: { paperId: "p15-5" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 404);
});
