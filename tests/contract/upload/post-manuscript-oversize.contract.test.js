import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("oversize manuscript is rejected", () => {
  const system = createUc06System();
  system.addAuthor("author@example.com");
  const draft = system.createDraftSubmission("author@example.com");
  const result = system.call("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId: draft.id },
    user: { email: "author@example.com" },
    file: system.validFile("paper.pdf", 8 * 1024 * 1024),
    body: { file_fingerprint: "paper.pdf" }
  });
  assert.equal(result.status, 400);
});
