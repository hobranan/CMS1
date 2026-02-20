import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("intermittent list retrieval failure recovers on retry", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "i1", title: "Recovery", content: "Should recover.", publishedAt: "2026-02-20T13:30:00.000Z", isPublic: true }
  ]);
  system.failListOnce();
  const failed = system.call("/api/v1/public/announcements:GET");
  const recovered = system.call("/api/v1/public/announcements:GET");
  assert.equal(failed.status, 500);
  assert.equal(recovered.status, 200);
});

