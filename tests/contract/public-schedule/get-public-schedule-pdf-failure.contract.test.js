import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("pdf retrieval failure returns 500", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-8", entries: [{ entryId: "e1" }] });
  system.failPdfRead();
  const response = system.call("/api/v1/public/conferences/:conferenceId/schedule.pdf:GET", { params: { conferenceId: "c18-8" } });
  assert.equal(response.status, 500);
});
