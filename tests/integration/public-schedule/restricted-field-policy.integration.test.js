import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("restricted fields hidden while allowed remain visible", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-i4", entries: [{ entryId: "e1", day: "D", session: "S", title: "T", startTime: "1", location: "L", speakers: ["X"], abstract: "A" }], publicPolicy: { allowSpeakers: false, allowAbstract: true } });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET", { params: { conferenceId: "c18-i4", entryId: "e1" } });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.speakers, []);
  assert.equal(response.body.abstract, "A");
});
