import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("GET assignments returns assigned referee details", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-101");
  system.seedReferee("r1");

  system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1"], expected_version: 0 }
  });

  const result = system.call("/api/v1/papers/:paperId/assignments:GET", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" }
  });

  assert.equal(result.status, 200);
  assert.deepEqual(result.body.referees, [{ referee_id: "r1" }]);
});

