import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("manuscript endpoint returns view_only mode for assigned paper", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref3@example.com");
  system.deps.assignedPaperRepository.seedAssignment({
    refereeId: referee.id,
    paperId: "paper-2",
    title: "Paper Two"
  });
  system.deps.assignedPaperRepository.seedManuscript({
    paperId: "paper-2",
    contentUrl: "https://example.com/manuscript/paper-2"
  });

  const response = system.call("/api/v1/papers/:paperId/manuscript-view:GET", {
    params: { paperId: "paper-2" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.accessMode, "view_only");
});

