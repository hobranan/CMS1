import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("POST manuscript upload success returns ATTACHED", () => {
  const system = createUc06System();
  system.addAuthor("author@example.com");
  const draft = system.createDraftSubmission("author@example.com");
  const result = system.call("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId: draft.id },
    user: { email: "author@example.com" },
    file: system.validFile("paper.pdf"),
    body: { file_fingerprint: "paper.pdf", mode: "RESTART", resume_offset_bytes: 0 }
  });
  assert.equal(result.status, 201);
  assert.equal(result.body.status, "ATTACHED");
});
