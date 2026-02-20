import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("decision visibility persists across repeated requests", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-12@example.com");
  const editor = system.addEditor("e15-12@example.com");
  system.seedPaper({ paperId: "p15-12", editorId: editor.id, authors: [author.id], completedReviewCount: 2 });
  system.recordDecision({ paperId: "p15-12", editorId: editor.id, outcome: "accept", comment: "Persistent" });

  const first = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-12" },
    user: { id: author.id, email: author.email, role: "author" }
  });
  const second = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-12" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(second.body.decisionStatus, "accepted");
});
