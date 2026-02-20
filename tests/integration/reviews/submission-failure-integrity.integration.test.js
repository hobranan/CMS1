import test from "node:test";
import assert from "node:assert/strict";
import { cancelBeforeSubmit } from "../../../frontend/src/controllers/reviews/review-submit-failure-controller.js";
import { createUc12System } from "../../helpers/uc12_system.js";

test("cancel, db failure, and notification failure preserve expected integrity", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref10@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-10",
    refereeId: referee.id,
    status: "active"
  });

  const cancel = cancelBeforeSubmit();
  assert.equal(cancel.mutated, false);

  system.deps.reviewSubmissionRepository.failNextSubmissionWrite();
  const dbFail = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-10" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "x" }, recommendation: "accept" }
  });
  assert.equal(dbFail.status, 500);
  assert.equal(system.deps.reviewSubmissionRepository.listSubmittedForAssignment("a-10").length, 0);

  system.deps.reviewNotificationService.failNextSend();
  const notifyFail = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-10" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "x" }, recommendation: "accept" }
  });
  assert.equal(notifyFail.status, 200);
  assert.equal(notifyFail.body.notificationStatus, "failed");
  assert.equal(system.deps.reviewSubmissionRepository.listSubmittedForAssignment("a-10").length, 1);
});

