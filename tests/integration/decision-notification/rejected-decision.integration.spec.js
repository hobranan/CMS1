import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("rejected decision is visible to owning author", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-7@example.com");
  const editor = system.addEditor("e15-7@example.com");
  system.seedPaper({ paperId: "p15-7", editorId: editor.id, authors: [author.id], completedReviewCount: 1 });
  system.recordDecision({ paperId: "p15-7", editorId: editor.id, outcome: "reject", comment: "Out of scope" });

  const response = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-7" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.decisionStatus, "rejected");
});
