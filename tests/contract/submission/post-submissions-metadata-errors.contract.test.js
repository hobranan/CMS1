import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("metadata validation failures return 400 with actionable errors", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();
  payload.body.abstract_text = "";
  payload.body.author_contact_email = "bad";

  const result = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: payload.file
  });
  assert.equal(result.status, 400);
  assert.equal(result.body.code, "SUBMISSION_VALIDATION_FAILED");
  assert.ok(result.body.errors.length >= 2);
});
