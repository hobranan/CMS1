import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("no assignments returns empty list and no-assigned message", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref10@example.com");

  const response = system.call("/api/v1/referees/:refereeId/assigned-papers:GET", {
    params: { refereeId: referee.id },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.papers, []);
  assert.equal(response.body.message, "No assigned papers.");
});

