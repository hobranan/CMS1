import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("storage failure returns 503 and no finalized submission", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();
  system.deps.submissionPersistenceService.forceNextFailure();

  const result = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: payload.file
  });
  assert.equal(result.status, 503);

  const mine = system.call("/api/v1/submissions/mine:GET", { user: { email: "author@example.com" } });
  assert.equal(mine.body.submissions.length, 0);
});
