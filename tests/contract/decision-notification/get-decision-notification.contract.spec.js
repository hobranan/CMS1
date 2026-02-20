import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("decision notification returns ordered summary and full review sections", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-4@example.com");
  const editor = system.addEditor("e15-4@example.com");
  system.seedPaper({
    paperId: "p15-4",
    editorId: editor.id,
    authors: [author.id],
    completedReviewCount: 2,
    reviewHighlights: ["Strong novelty", "Clear evaluation"],
    fullReviewContent: { text: "Full reviewer text" }
  });
  system.recordDecision({ paperId: "p15-4", editorId: editor.id, outcome: "reject", comment: "Needs revisions" });

  const response = system.call("/api/v1/author/papers/:paperId/decision-notification:GET", {
    params: { paperId: "p15-4" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.sectionOrder, ["decision_header", "summary_bullets", "full_review"]);
});
