import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("detail shows unavailable markers when optional fields hidden", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-i3", entries: [{ entryId: "e1", day: "D", session: "S", title: "T", startTime: "1", location: "L", speakers: ["X"], abstract: "A" }], publicPolicy: { allowSpeakers: false, allowAbstract: true } });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET", { params: { conferenceId: "c18-i3", entryId: "e1" } });
  assert.equal(response.status, 200);
  assert.ok(response.body.unavailableFields.includes("speakers"));
});
