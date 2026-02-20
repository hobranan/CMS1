import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("upload interruption returns guidance and does not create finalized submission", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");

  const result = system.call("/api/v1/submissions/upload-status:POST", {
    body: { submission_id: "transient-upload-id", status: "INTERRUPTED" }
  });
  assert.equal(result.status, 200);

  const mine = system.call("/api/v1/submissions/mine:GET", { user: { email: "author@example.com" } });
  assert.equal(mine.status, 200);
  assert.equal(mine.body.submissions.length, 0);
});
