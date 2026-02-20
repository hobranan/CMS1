import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("list/detail payloads omit identity fields", () => {
  const system = createUc13System();
  const editor = system.addEditor("ed4@example.com");
  const referee = system.addReferee("ref4@example.com");
  system.seedAssignment({ assignmentId: "a4", paperId: "p4", editorId: editor.id, refereeId: referee.id, status: "completed" });
  const submitted = system.seedSubmittedReview({ assignmentId: "a4", refereeId: referee.id, fields: { clarity: "high" }, recommendation: "accept", comments: "Clear", now: new Date("2026-02-20T03:00:00.000Z") });

  const list = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "p4" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(list.body.reviews[0].refereeId, undefined);

  const detail = system.call("/api/v1/papers/:paperId/completed-reviews/:reviewId:GET", { params: { paperId: "p4", reviewId: submitted.reviewId }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(detail.body.refereeId, undefined);
});
