import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("assigned list retrieval failure returns 500", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref6@example.com");
  system.deps.assignedPaperRepository.failNextListRead();

  const response = system.call("/api/v1/referees/:refereeId/assigned-papers:GET", {
    params: { refereeId: referee.id },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(response.status, 500);
});

