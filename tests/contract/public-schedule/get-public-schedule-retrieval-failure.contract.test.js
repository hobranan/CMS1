import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("public schedule retrieval failure returns 500", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-7", entries: [{ entryId: "e1" }] });
  system.failScheduleRead();
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c18-7" } });
  assert.equal(response.status, 500);
});
