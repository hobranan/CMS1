import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("generation latency p95 is below target in local harness", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-i8@example.com", "admin");
  system.seedConference({
    conferenceId: "c16-i8",
    acceptedPapers: Array.from({ length: 12 }, (_, i) => ({ paperId: `p${i}` })),
    rooms: [{ roomId: "r1", roomName: "A" }, { roomId: "r2", roomName: "B" }],
    parameters: { slotMinutes: 20, totalSlots: 6, startMinute: 480 }
  });
  const samples = [];
  for (let i = 0; i < 25; i += 1) {
    const start = performance.now();
    const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", { params: { conferenceId: "c16-i8" }, body: { seed: i }, user: { id: editor.id, email: editor.email, role: "admin" } });
    assert.equal(response.status, 200);
    samples.push(performance.now() - start);
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1] ?? sorted[sorted.length - 1];
  assert.ok(p95 < 400, `expected p95 < 400ms, got ${p95}`);
});
