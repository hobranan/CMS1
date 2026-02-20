import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("pdf attachment response has attachment disposition", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-6", entries: [{ entryId: "e1" }] });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule.pdf:GET", { params: { conferenceId: "c18-6" }, query: { disposition: "attachment" } });
  assert.equal(response.status, 200);
  assert.ok(response.body.disposition.startsWith("attachment"));
});
