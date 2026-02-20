import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("error payloads are redacted for unauthorized and retrieval failures", () => {
  const system = createUc13System();
  const owner = system.addEditor("owner@example.com");
  const outsider = system.addEditor("outsider@example.com");
  const referee = system.addReferee("ref8@example.com");
  system.seedAssignment({ assignmentId: "a8", paperId: "p8", editorId: owner.id, refereeId: referee.id, status: "completed" });
  system.seedSubmittedReview({ assignmentId: "a8", refereeId: referee.id, fields: { score: "A" }, recommendation: "accept", comments: "Great", now: new Date("2026-02-20T07:00:00.000Z") });

  const forbidden = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "p8" }, user: { id: outsider.id, email: outsider.email, role: "editor" } });
  assert.equal(forbidden.status, 403);
  assert.equal(typeof forbidden.body.message, "string");
  assert.equal(forbidden.body.reviewId, undefined);

  system.deps.reviewSubmissionRepository.failNextSubmissionRead();
  const failed = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "p8" }, user: { id: owner.id, email: owner.email, role: "editor" } });
  assert.equal(failed.status, 500);
  assert.equal(failed.body.reviewId, undefined);
});
