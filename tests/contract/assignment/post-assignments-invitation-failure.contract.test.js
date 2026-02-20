import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("invitation failure keeps assignment empty (rollback)", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-106");
  system.seedReferee("r1");
  system.seedReferee("r2");
  system.deps.reviewInvitationService.failNextDispatch();

  const result = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1", "r2"], expected_version: 0 }
  });
  assert.equal(result.status, 503);

  const details = system.call("/api/v1/papers/:paperId/assignments:GET", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" }
  });
  assert.equal(details.status, 200);
  assert.deepEqual(details.body.referees, []);
});

