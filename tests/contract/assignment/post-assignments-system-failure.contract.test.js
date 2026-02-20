import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("POST assignments returns 503 when invitation dispatch fails and rolls back", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-105");
  system.seedReferee("r1");
  system.deps.reviewInvitationService.failNextDispatch();

  const result = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1"], expected_version: 0 }
  });

  assert.equal(result.status, 503);
});

