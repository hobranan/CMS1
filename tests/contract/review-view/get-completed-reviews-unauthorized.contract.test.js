import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("unauthorized users are blocked from completed review list and detail", () => {
  const system = createUc13System();
  const editor = system.addEditor("ed5@example.com");
  const outsider = system.addEditor("ed6@example.com");
  const referee = system.addReferee("ref5@example.com");
  system.seedAssignment({ assignmentId: "a5", paperId: "p5", editorId: editor.id, refereeId: referee.id, status: "completed" });
  const submitted = system.seedSubmittedReview({ assignmentId: "a5", refereeId: referee.id, fields: { novelty: "high" }, recommendation: "accept", comments: "Novel", now: new Date("2026-02-20T04:00:00.000Z") });

  const list = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "p5" }, user: { id: outsider.id, email: outsider.email, role: "editor" } });
  assert.equal(list.status, 403);

  const detail = system.call("/api/v1/papers/:paperId/completed-reviews/:reviewId:GET", { params: { paperId: "p5", reviewId: submitted.reviewId }, user: { id: outsider.id, email: outsider.email, role: "editor" } });
  assert.equal(detail.status, 403);
});
