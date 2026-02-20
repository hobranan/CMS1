import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";
import { refreshAssignedAccess } from "../../../frontend/src/controllers/assigned-access/assigned-paper-access-refresh-controller.js";

test("refresh replaces cached state with server state and surfaces unavailable resource", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref11@example.com");
  system.deps.assignedPaperRepository.seedAssignment({
    refereeId: referee.id,
    paperId: "paper-8",
    title: "Paper Eight"
  });
  system.deps.assignedPaperRepository.seedManuscript({
    paperId: "paper-8",
    contentUrl: "https://example.com/m8"
  });

  const first = system.call("/api/v1/papers/:paperId/manuscript-view:GET", {
    params: { paperId: "paper-8" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(first.status, 200);

  system.deps.assignedPaperRepository.manuscriptsByPaper.delete("paper-8");
  const refreshed = refreshAssignedAccess(() => system.call("/api/v1/papers/:paperId/manuscript-view:GET", {
    params: { paperId: "paper-8" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  }));
  assert.equal(refreshed.status, 404);
});

