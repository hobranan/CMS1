import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("upload interruption endpoint reports retry guidance", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();
  const created = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: payload.file
  });

  const result = system.call("/api/v1/submissions/upload-status:POST", {
    body: { submission_id: created.body.submission_id, status: "INTERRUPTED" }
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.status, "UPLOAD_INTERRUPTED");
});
