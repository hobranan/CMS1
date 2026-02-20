import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("POST assignments returns success for valid 1..3 eligible referees", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-100");
  system.seedReferee("r1");
  system.seedReferee("r2");
  system.seedReferee("r3");

  const result = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1", "r2", "r3"], expected_version: 0 }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "ASSIGNMENT_FINALIZED");
  assert.deepEqual(result.body.assigned_referee_ids, ["r1", "r2", "r3"]);
});

