import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("get paper decision returns final decision for owning author", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-1@example.com");
  const editor = system.addEditor("e15-1@example.com");
  system.seedPaper({ paperId: "p15-1", editorId: editor.id, authors: [author.id], completedReviewCount: 2 });
  system.recordDecision({ paperId: "p15-1", editorId: editor.id, outcome: "accept", comment: "Strong" });

  const response = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-1" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.decisionStatus, "accepted");
});
