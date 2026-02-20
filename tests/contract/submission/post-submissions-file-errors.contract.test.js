import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("missing/invalid/oversize file failures return 400", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();

  const missing = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body
  });
  assert.equal(missing.status, 400);

  const invalidType = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: { fileName: "paper.exe", contentType: "application/x-msdownload", sizeBytes: 1000 }
  });
  assert.equal(invalidType.status, 400);

  const oversized = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: { fileName: "paper.pdf", contentType: "application/pdf", sizeBytes: 8 * 1024 * 1024 }
  });
  assert.equal(oversized.status, 400);
});
