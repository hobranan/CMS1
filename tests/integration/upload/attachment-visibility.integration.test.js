import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("attachment remains visible after refresh/navigation", () => {
  const system = createUc06System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraftSubmission(email);
  system.call("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId: draft.id },
    user: { email },
    file: system.validFile("paper.docx"),
    body: { file_fingerprint: "paper.docx" }
  });
  const one = system.deps.fileAttachmentRecordRepository.get(draft.id);
  const two = system.deps.fileAttachmentRecordRepository.get(draft.id);
  assert.equal(one.attached, true);
  assert.equal(two.attached, true);
});
