import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("open failure returns 404 when review is unavailable", () => {
  const system = createUc13System();
  const editor = system.addEditor("ed8@example.com");
  const referee = system.addReferee("ref7@example.com");
  system.seedAssignment({ assignmentId: "a7", paperId: "p7", editorId: editor.id, refereeId: referee.id, status: "completed" });
  system.seedSubmittedReview({ assignmentId: "a7", refereeId: referee.id, fields: { rigor: "strong" }, recommendation: "accept", comments: "Strong", now: new Date("2026-02-20T06:00:00.000Z") });

  const response = system.call("/api/v1/papers/:paperId/completed-reviews/:reviewId:GET", { params: { paperId: "p7", reviewId: "missing-review" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(response.status, 404);
});
