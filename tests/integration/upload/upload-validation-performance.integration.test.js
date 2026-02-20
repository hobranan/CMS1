import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("pre-upload validation and attachment decision completes under 300ms", () => {
  const system = createUc06System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraftSubmission(email);
  const start = Date.now();
  const result = system.call("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId: draft.id },
    user: { email },
    file: system.validFile("paper.pdf"),
    body: { file_fingerprint: "paper.pdf" }
  });
  const elapsed = Date.now() - start;
  assert.equal(result.status, 201);
  assert.ok(elapsed < 300);
});
