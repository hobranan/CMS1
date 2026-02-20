import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("unauthenticated users can access published schedule", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-i1", entries: [{ entryId: "e1", day: "Day1", session: "S", title: "Talk", startTime: "09:00", location: "Hall" }] });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c18-i1" } });
  assert.equal(response.status, 200);
});
