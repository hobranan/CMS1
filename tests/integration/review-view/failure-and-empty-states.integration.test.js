import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("empty and failure states are explicit and recoverable", () => {
  const system = createUc13System();
  const editor = system.addEditor("int3@example.com");
  const referee = system.addReferee("intref3@example.com");
  system.seedAssignment({ assignmentId: "i3", paperId: "ip3", editorId: editor.id, refereeId: referee.id, status: "active" });

  const empty = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "ip3" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(empty.status, 200);
  assert.deepEqual(empty.body.reviews, []);

  const missing = system.call("/api/v1/papers/:paperId/completed-reviews/:reviewId:GET", { params: { paperId: "ip3", reviewId: "missing" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(missing.status, 404);
});
