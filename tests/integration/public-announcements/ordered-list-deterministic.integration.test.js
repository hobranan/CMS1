import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("public list ordering is newest-first with id fallback for same timestamp", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "a10", title: "Same date A", content: "A", publishedAt: "2026-02-20T10:00:00.000Z", isPublic: true },
    { announcementId: "a11", title: "Same date B", content: "B", publishedAt: "2026-02-20T10:00:00.000Z", isPublic: true },
    { announcementId: "a09", title: "Older", content: "C", publishedAt: "2026-02-19T10:00:00.000Z", isPublic: true }
  ]);
  const response = system.call("/api/v1/public/announcements:GET");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.items.map((x) => x.announcementId), ["a11", "a10", "a09"]);
});

