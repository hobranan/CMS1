import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("submission validation/finalization decision completes under 500ms", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();
  const start = Date.now();
  const result = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: payload.file
  });
  const elapsed = Date.now() - start;
  assert.equal(result.status, 201);
  assert.ok(elapsed < 500);
});
