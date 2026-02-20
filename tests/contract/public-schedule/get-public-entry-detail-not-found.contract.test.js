import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("entry detail not found returns 404", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-4", entries: [] });
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET", { params: { conferenceId: "c18-4", entryId: "missing" } });
  assert.equal(response.status, 404);
});
