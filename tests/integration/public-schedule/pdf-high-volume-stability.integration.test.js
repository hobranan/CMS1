import test from "node:test";
import assert from "node:assert/strict";
import { createUc18System } from "../../helpers/uc18_system.js";

test("pdf endpoint remains stable under repeated public access", () => {
  const system = createUc18System();
  system.seedPublishedSchedule({ conferenceId: "c18-i6", entries: Array.from({ length: 8 }, (_, i) => ({ entryId: `e${i}` })) });
  for (let i = 0; i < 30; i += 1) {
    const response = system.call("/api/v1/public/conferences/:conferenceId/schedule.pdf:GET", { params: { conferenceId: "c18-i6" }, query: { disposition: i % 2 === 0 ? "inline" : "attachment" } });
    assert.equal(response.status, 200);
  }
});
