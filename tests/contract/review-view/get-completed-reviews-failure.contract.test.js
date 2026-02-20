import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("list retrieval failure returns 500 and no review data", () => {
  const system = createUc13System();
  const editor = system.addEditor("ed7@example.com");
  const referee = system.addReferee("ref6@example.com");
  system.seedAssignment({ assignmentId: "a6", paperId: "p6", editorId: editor.id, refereeId: referee.id, status: "completed" });
  system.seedSubmittedReview({ assignmentId: "a6", refereeId: referee.id, fields: { relevance: "high" }, recommendation: "accept", comments: "Relevant", now: new Date("2026-02-20T05:00:00.000Z") });
  system.deps.reviewSubmissionRepository.failNextSubmissionRead();

  const response = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "p6" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(response.status, 500);
  assert.equal(response.body.code, "RETRIEVAL_ERROR");
});
