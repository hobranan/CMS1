import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { createUc22System } from "../../helpers/uc22_system.js";

test("public announcements list/detail latency stays under p95 target", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "l1", title: "Latency one", content: "A", publishedAt: "2026-02-20T14:00:00.000Z", isPublic: true },
    { announcementId: "l2", title: "Latency two", content: "B", publishedAt: "2026-02-20T14:05:00.000Z", isPublic: true }
  ]);

  const samples = [];
  for (let i = 0; i < 20; i += 1) {
    const start = performance.now();
    const list = system.call("/api/v1/public/announcements:GET");
    system.call("/api/v1/public/announcements/:announcementId:GET", {
      params: { announcementId: list.body.items[0].announcementId }
    });
    samples.push(performance.now() - start);
  }
  const sorted = samples.slice().sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1];
  assert.ok(p95 < 500, `expected p95 < 500ms, got ${p95.toFixed(2)}ms`);
});

