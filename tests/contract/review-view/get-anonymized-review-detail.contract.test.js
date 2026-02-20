import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("detail endpoint returns anonymized completed review", () => {
  const system = createUc13System();
  const editor = system.addEditor("ed3@example.com");
  const referee = system.addReferee("ref3@example.com");
  system.seedAssignment({ assignmentId: "a3", paperId: "p3", editorId: editor.id, refereeId: referee.id, status: "completed" });
  const submitted = system.seedSubmittedReview({ assignmentId: "a3", refereeId: referee.id, fields: { quality: "good" }, recommendation: "reject", comments: "Needs work", now: new Date("2026-02-20T02:00:00.000Z") });

  const response = system.call("/api/v1/papers/:paperId/completed-reviews/:reviewId:GET", { params: { paperId: "p3", reviewId: submitted.reviewId }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(response.status, 200);
  assert.equal(response.body.identityRemoved, true);
});
