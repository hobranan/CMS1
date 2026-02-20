import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("pdf inline response has inline disposition", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-5", entries: [{ entryId: "e1" }] });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule.pdf:GET", { params: { conferenceId: "c18-5" }, query: { disposition: "inline" } });
  assert.equal(response.status, 200);
  assert.ok(response.body.disposition.startsWith("inline"));
});
