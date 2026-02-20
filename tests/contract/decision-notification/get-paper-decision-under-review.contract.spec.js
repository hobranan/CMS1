import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("under-review response is returned when no final decision exists", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-2@example.com");
  const editor = system.addEditor("e15-2@example.com");
  system.seedPaper({ paperId: "p15-2", editorId: editor.id, authors: [author.id], status: "under_review", completedReviewCount: 1 });

  const response = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-2" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.decisionStatus, "under_review");
});
