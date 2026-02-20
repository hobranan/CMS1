import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("direct link and refresh remain stable", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-i2", entries: [{ entryId: "e1", day: "Day1", session: "S", title: "Talk", startTime: "09:00", location: "Hall" }] });
  const a = system.call("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c18-i2" } });
  const b = system.call("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c18-i2" } });
  assert.equal(a.status, 200);
  assert.equal(b.status, 200);
});
