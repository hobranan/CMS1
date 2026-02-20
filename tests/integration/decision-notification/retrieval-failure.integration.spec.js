import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("retrieval failure returns system error without decision details", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-11@example.com");
  const editor = system.addEditor("e15-11@example.com");
  system.seedPaper({ paperId: "p15-11", editorId: editor.id, authors: [author.id], completedReviewCount: 1 });
  system.recordDecision({ paperId: "p15-11", editorId: editor.id, outcome: "reject", comment: "Not enough evidence" });
  system.failNextRead();

  const response = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-11" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 500);
  assert.equal(response.body.decisionStatus, undefined);
});
