import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("storage and association failures keep unattached state", () => {
  const system = createUc06System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraftSubmission(email);

  system.deps.uploadTransferService.failNextWithStorageFailure();
  const storageFail = system.call("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId: draft.id },
    user: { email },
    file: system.validFile("paper.pdf"),
    body: { file_fingerprint: "paper.pdf" }
  });
  assert.equal(storageFail.status, 503);
  assert.equal(system.deps.fileAttachmentRecordRepository.get(draft.id).attached, false);

  system.deps.attachmentAssociationService.failNext();
  const assocFail = system.call("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId: draft.id },
    user: { email },
    file: system.validFile("paper.pdf"),
    body: { file_fingerprint: "paper.pdf" }
  });
  assert.equal(assocFail.status, 409);
  assert.equal(system.deps.fileAttachmentRecordRepository.get(draft.id).attached, false);
});
