import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("POST /submissions success returns 201 finalized payload", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();
  const result = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: payload.file
  });
  assert.equal(result.status, 201);
  assert.equal(result.body.status, "FINALIZED");
  assert.ok(result.body.submission_id);
});
