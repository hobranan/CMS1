import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("editor can open anonymized detail and return to list flow stays consistent", () => {
  const system = createUc13System();
  const editor = system.addEditor("int2@example.com");
  const referee = system.addReferee("intref2@example.com");
  system.seedAssignment({ assignmentId: "i2", paperId: "ip2", editorId: editor.id, refereeId: referee.id, status: "completed" });
  const review = system.seedSubmittedReview({ assignmentId: "i2", refereeId: referee.id, fields: { depth: "high" }, recommendation: "reject", comments: "Revise", now: new Date("2026-02-20T09:00:00.000Z") });

  const detail = system.call("/api/v1/papers/:paperId/completed-reviews/:reviewId:GET", { params: { paperId: "ip2", reviewId: review.reviewId }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(detail.status, 200);
  assert.equal(detail.body.identityRemoved, true);

  const back = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "ip2" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(back.status, 200);
  assert.equal(back.body.reviews.length, 1);
});
