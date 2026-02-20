import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("completed review list excludes draft/incomplete reviews", () => {
  const system = createUc13System();
  const editor = system.addEditor("ed2@example.com");
  const referee = system.addReferee("ref2@example.com");
  system.seedAssignment({ assignmentId: "a2", paperId: "p2", editorId: editor.id, refereeId: referee.id, status: "active" });
  system.seedDraft({ assignmentId: "a2", requiredFields: { originality: "" }, recommendation: "", comments: "" });

  const response = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "p2" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.reviews, []);
});
