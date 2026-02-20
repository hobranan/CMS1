import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("POST assignments rejects duplicate, ineligible, and workload-exceeded referee selections", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-104");
  system.seedReferee("dup");
  system.seedReferee("ineligible", { eligible: false });
  system.seedReferee("busy", { currentLoad: 3, maxLoad: 3 });

  const duplicate = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["dup", "dup"], expected_version: 0 }
  });
  assert.equal(duplicate.status, 400);

  const ineligible = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["ineligible"], expected_version: 0 }
  });
  assert.equal(ineligible.status, 400);

  const busy = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["busy"], expected_version: 0 }
  });
  assert.equal(busy.status, 400);
});

