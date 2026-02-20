import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("editor can load completed review list and only sees submitted entries", () => {
  const system = createUc13System();
  const editor = system.addEditor("int1@example.com");
  const referee = system.addReferee("intref1@example.com");
  system.seedAssignment({ assignmentId: "i1", paperId: "ip1", editorId: editor.id, refereeId: referee.id, status: "completed" });
  system.seedSubmittedReview({ assignmentId: "i1", refereeId: referee.id, fields: { merit: "high" }, recommendation: "accept", comments: "Good", now: new Date("2026-02-20T08:00:00.000Z") });

  const response = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "ip1" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(response.status, 200);
  assert.equal(response.body.reviews.length, 1);
});
