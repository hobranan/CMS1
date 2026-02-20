import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("successful upload attaches manuscript to draft", () => {
  const system = createUc06System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraftSubmission(email);
  const result = system.call("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId: draft.id },
    user: { email },
    file: system.validFile("paper.PDF"),
    body: { file_fingerprint: "paper.PDF" }
  });
  assert.equal(result.status, 201);
  assert.equal(system.deps.fileAttachmentRecordRepository.get(draft.id).attached, true);
});
