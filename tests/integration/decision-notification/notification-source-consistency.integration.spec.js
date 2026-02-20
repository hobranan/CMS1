import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("summary bullets and full review come from same decision source", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-9@example.com");
  const editor = system.addEditor("e15-9@example.com");
  system.seedPaper({
    paperId: "p15-9",
    editorId: editor.id,
    authors: [author.id],
    reviewHighlights: ["Same source bullet"],
    fullReviewContent: { source: "editor-decision-source", text: "Same source full review" },
    completedReviewCount: 1
  });
  system.recordDecision({ paperId: "p15-9", editorId: editor.id, outcome: "accept", comment: "Same source" });

  const response = system.call("/api/v1/author/papers/:paperId/decision-notification:GET", {
    params: { paperId: "p15-9" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 200);
  assert.ok(response.body.summaryBullets.some((b) => b.includes("Same source")));
  assert.equal(response.body.fullReviewContent.source, "editor-decision-source");
});
