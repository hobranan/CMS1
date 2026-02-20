import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("missing review form for assigned paper returns 404", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref8@example.com");
  system.deps.assignedPaperRepository.seedAssignment({
    refereeId: referee.id,
    paperId: "paper-6",
    title: "Paper Six"
  });

  const response = system.call("/api/v1/papers/:paperId/review-form:GET", {
    params: { paperId: "paper-6" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(response.status, 404);
});

