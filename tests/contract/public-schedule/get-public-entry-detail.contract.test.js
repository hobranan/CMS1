import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("public entry detail returns projected fields", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({
    conferenceId: "c18-3",
    entries: [{ entryId: "e1", day: "Day 1", session: "S1", title: "Talk", startTime: "10:00", location: "Room A", speakers: ["A"], abstract: "Abs" }],
    publicPolicy: { allowSpeakers: true, allowAbstract: true }
  });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET", { params: { conferenceId: "c18-3", entryId: "e1" } });
  assert.equal(response.status, 200);
  assert.equal(response.body.entryId, "e1");
});
