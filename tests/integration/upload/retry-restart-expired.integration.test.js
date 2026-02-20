import test from "node:test";
import assert from "node:assert/strict";
import { createUc06System } from "../../helpers/uc06_system.js";

test("retry after 30 minutes returns RESTART and clears stale checkpoint", () => {
  const system = createUc06System();
  const email = "author@example.com";
  system.addAuthor(email);
  const draft = system.createDraftSubmission(email);
  const fp = "paper.pdf";
  system.deps.uploadProgressStateRepository.saveCheckpoint({
    submissionId: draft.id,
    fileFingerprint: fp,
    offsetBytes: 2048,
    now: new Date("2026-02-20T00:00:00.000Z")
  });
  system.setNow("2026-02-20T00:31:00.000Z");
  const retry = system.call("/api/v1/submissions/:submissionId/manuscript/retry:POST", {
    params: { submissionId: draft.id },
    body: { file_fingerprint: fp }
  });
  assert.equal(retry.body.mode, "RESTART");
  assert.equal(system.deps.uploadProgressStateRepository.getCheckpoint(draft.id, fp), null);
});
