import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("list success with single detail retrieval failure is handled", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-i5", entries: [{ entryId: "e1", day: "D", session: "S", title: "T", startTime: "1", location: "L" }] });
  const list = system.call("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c18-i5" } });
  system.failEntryRead();
  const detail = system.call("/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET", { params: { conferenceId: "c18-i5", entryId: "e1" } });
  assert.equal(list.status, 200);
  assert.equal(detail.status, 500);
});
