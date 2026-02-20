import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("submit review rejects missing required fields", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref3@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-3",
    refereeId: referee.id,
    status: "active"
  });

  const res = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-3" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: {
      fields: { novelty: "" },
      recommendation: ""
    }
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.code, "VALIDATION_FAILED");
  assert.ok(Array.isArray(res.body.errors));
});

