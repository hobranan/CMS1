import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("retry within 30 minutes returns RESUME mode from checkpoint", () => {
  const system = createUc06System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraftSubmission(email);
  const fp = "paper.pdf";
  system.deps.uploadProgressStateRepository.saveCheckpoint({
    submissionId: draft.id,
    fileFingerprint: fp,
    offsetBytes: 4096,
    now: new Date("2026-02-20T00:00:00.000Z")
  });
  system.setNow("2026-02-20T00:20:00.000Z");
  const retry = system.call("/api/v1/submissions/:submissionId/manuscript/retry:POST", {
    params: { submissionId: draft.id },
    body: { file_fingerprint: fp }
  });
  assert.equal(retry.body.mode, "RESUME");
  assert.equal(retry.body.resume_offset_bytes, 4096);
});
