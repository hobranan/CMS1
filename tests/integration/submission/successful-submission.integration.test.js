import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("successful submission finalizes and appears in author list", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();
  const created = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: payload.file
  });
  assert.equal(created.status, 201);

  const mine = system.call("/api/v1/submissions/mine:GET", { user: { email: "author@example.com" } });
  assert.equal(mine.status, 200);
  assert.equal(mine.body.submissions.length, 1);
});
