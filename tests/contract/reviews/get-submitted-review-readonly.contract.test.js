import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("submitted review is returned as read-only", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref5@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-5",
    refereeId: referee.id,
    status: "active"
  });
  const submit = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-5" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "ok" }, recommendation: "accept" }
  });

  const res = system.call("/api/v1/reviews/:reviewId:GET", {
    params: { reviewId: submit.body.reviewId },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.readOnly, true);
});

