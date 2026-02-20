import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("assigned papers endpoint returns scoped papers and empty state", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref1@example.com");
  system.deps.assignedPaperRepository.seedAssignment({
    refereeId: referee.id,
    paperId: "paper-1",
    title: "Paper One"
  });

  const success = system.call("/api/v1/referees/:refereeId/assigned-papers:GET", {
    params: { refereeId: referee.id },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(success.status, 200);
  assert.equal(success.body.papers.length, 1);

  const otherRef = system.addReferee("ref2@example.com");
  const empty = system.call("/api/v1/referees/:refereeId/assigned-papers:GET", {
    params: { refereeId: otherRef.id },
    user: { email: otherRef.email, id: otherRef.id, role: "referee" }
  });
  assert.equal(empty.status, 200);
  assert.deepEqual(empty.body.papers, []);
});

