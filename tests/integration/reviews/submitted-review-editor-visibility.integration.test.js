import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("submitted review is visible to authorized editor", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref7@example.com");
  const editor = system.addEditor("editor1@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-7",
    refereeId: referee.id,
    editorId: editor.id,
    status: "active"
  });

  const submit = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-7" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "ok" }, recommendation: "accept" }
  });
  assert.equal(submit.status, 200);

  const editorView = system.call("/api/v1/reviews/:reviewId:GET", {
    params: { reviewId: submit.body.reviewId },
    user: { email: editor.email, id: editor.id, role: "editor" }
  });
  assert.equal(editorView.status, 200);
});

