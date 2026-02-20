import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("notification content keeps summary before full review", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-8@example.com");
  const editor = system.addEditor("e15-8@example.com");
  system.seedPaper({
    paperId: "p15-8",
    editorId: editor.id,
    authors: [author.id],
    completedReviewCount: 2,
    reviewHighlights: ["Method gap", "Dataset mismatch"],
    fullReviewContent: { text: "Detailed full review" }
  });
  system.recordDecision({ paperId: "p15-8", editorId: editor.id, outcome: "reject", comment: "Major fixes required" });

  const response = system.call("/api/v1/author/papers/:paperId/decision-notification:GET", {
    params: { paperId: "p15-8" },
    user: { id: author.id, email: author.email, role: "author" }
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.sectionOrder, ["decision_header", "summary_bullets", "full_review"]);
  assert.ok(Array.isArray(response.body.summaryBullets));
  assert.ok(response.body.fullReviewContent);
});
