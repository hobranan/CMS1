import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("missing manuscript for assigned paper returns 404", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref7@example.com");
  system.deps.assignedPaperRepository.seedAssignment({
    refereeId: referee.id,
    paperId: "paper-5",
    title: "Paper Five"
  });

  const response = system.call("/api/v1/papers/:paperId/manuscript-view:GET", {
    params: { paperId: "paper-5" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(response.status, 404);
});

