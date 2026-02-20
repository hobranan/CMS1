import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("public schedule list is returned for published conference", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-1", entries: [{ entryId: "e1", day: "Day 1", session: "S1", title: "Opening", startTime: "09:00", location: "Hall" }] });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c18-1" } });
  assert.equal(response.status, 200);
  assert.equal(response.body.days.length, 1);
});
