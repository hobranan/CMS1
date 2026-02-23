import test from "node:test";
import assert from "node:assert/strict";
import { PublicScheduleObservabilityService } from "../../backend/src/services/public-schedule/public-schedule-observability-service.js";

test("public schedule observability records events", () => {
  const service = new PublicScheduleObservabilityService();
  service.record("FETCH", { conferenceId: "conf-1" });
  service.record("EMPTY");

  assert.deepEqual(service.events, [
    { event: "FETCH", payload: { conferenceId: "conf-1" } },
    { event: "EMPTY", payload: {} }
  ]);
});
