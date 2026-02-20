import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("completed review list returns anonymized submitted reviews", () => {
  const system = createUc13System();
  const editor = system.addEditor("ed1@example.com");
  const referee = system.addReferee("ref1@example.com");
  system.seedAssignment({ assignmentId: "a1", paperId: "p1", editorId: editor.id, refereeId: referee.id, status: "completed" });
  system.seedSubmittedReview({ assignmentId: "a1", refereeId: referee.id, fields: { originality: "strong" }, recommendation: "accept", comments: "Well done", now: new Date("2026-02-20T01:00:00.000Z") });

  const response = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "p1" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(response.status, 200);
  assert.equal(response.body.reviews.length, 1);
  assert.equal(response.body.reviews[0].identityRemoved, true);
  assert.equal(response.body.reviews[0].refereeId, undefined);
});
