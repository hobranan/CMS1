import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("public announcements list returns 204 when no public announcements exist", () => {
  const system = createUc22System();
  const response = system.call("/api/v1/public/announcements:GET");
  assert.equal(response.status, 204);
});

