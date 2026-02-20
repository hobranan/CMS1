import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("retry mode endpoint returns RESUME or RESTART", () => {
  const system = createUc06System();
  system.addAuthor("author@example.com");
  const draft = system.createDraftSubmission("author@example.com");
  const fp = "paper.pdf";

  const restart = system.call("/api/v1/submissions/:submissionId/manuscript/retry:POST", {
    params: { submissionId: draft.id },
    body: { file_fingerprint: fp }
  });
  assert.equal(restart.status, 200);
  assert.equal(restart.body.mode, "RESTART");

  system.deps.uploadProgressStateRepository.saveCheckpoint({
    submissionId: draft.id,
    fileFingerprint: fp,
    offsetBytes: 1234,
    now: new Date("2026-02-20T00:00:00.000Z")
  });
  system.setNow("2026-02-20T00:10:00.000Z");
  const resume = system.call("/api/v1/submissions/:submissionId/manuscript/retry:POST", {
    params: { submissionId: draft.id },
    body: { file_fingerprint: fp }
  });
  assert.equal(resume.body.mode, "RESUME");
});
