import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("public announcements list returns 500 on retrieval failure", () => {
  const system = createUc22System();
  system.failListOnce();
  const response = system.call("/api/v1/public/announcements:GET");
  assert.equal(response.status, 500);
  assert.equal(response.body.code, "ANNOUNCEMENT_RETRIEVAL_FAILED");
});

