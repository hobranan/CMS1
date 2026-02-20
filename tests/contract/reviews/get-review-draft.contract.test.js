import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("get review draft returns informational deadline indicator", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref1@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-1",
    refereeId: referee.id,
    status: "active",
    deadlineIndicator: "2026-03-01T00:00:00.000Z"
  });
  system.deps.reviewSubmissionRepository.seedDraft({
    assignmentId: "a-1",
    requiredFields: { novelty: "" }
  });

  const res = system.call("/api/v1/assignments/:assignmentId/review-draft:GET", {
    params: { assignmentId: "a-1" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.deadlineEnforced, false);
  assert.equal(res.body.deadlineIndicator, "2026-03-01T00:00:00.000Z");
});

