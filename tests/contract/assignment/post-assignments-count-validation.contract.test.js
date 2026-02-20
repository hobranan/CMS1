import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("POST assignments rejects zero selections", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-102");
  const result = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: [], expected_version: 0 }
  });
  assert.equal(result.status, 400);
});

test("POST assignments rejects more than three selections", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-103");
  system.seedReferee("r1");
  system.seedReferee("r2");
  system.seedReferee("r3");
  system.seedReferee("r4");
  const result = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1", "r2", "r3", "r4"], expected_version: 0 }
  });
  assert.equal(result.status, 400);
});

