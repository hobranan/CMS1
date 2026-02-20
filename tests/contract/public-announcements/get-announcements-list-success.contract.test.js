import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("public announcements list returns 200 with ordering metadata", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "a1", title: "Welcome", content: "Opening update", publishedAt: "2026-02-20T10:00:00.000Z", isPublic: true }
  ]);
  const response = system.call("/api/v1/public/announcements:GET");
  assert.equal(response.status, 200);
  assert.equal(response.body.ordering, "published_at_desc_then_id_desc");
  assert.equal(response.body.items.length, 1);
});

