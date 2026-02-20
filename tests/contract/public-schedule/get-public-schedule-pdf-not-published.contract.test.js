import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("pdf not published returns 404", () => {
  const system = createUc18System();
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule.pdf:GET", { params: { conferenceId: "c18-9" } });
  assert.equal(response.status, 404);
});
