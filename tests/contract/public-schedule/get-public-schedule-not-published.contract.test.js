import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("public schedule returns 404 when not published", () => {
  const system = createUc18System();
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c18-2" } });
  assert.equal(response.status, 404);
});
