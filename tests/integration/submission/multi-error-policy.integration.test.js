import test from "node:test";
import assert from "node:assert/strict";
import { createUc05System } from "../../helpers/uc05_system.js";

test("multiple validation issues return all actionable errors and no finalized record", () => {
  const system = createUc05System();
  system.addAuthor("author@example.com");
  const payload = system.validSubmissionPayload();
  payload.body.author_names = "";
  payload.body.keywords = "   ";
  payload.file.contentType = "application/x-msdownload";

  const result = system.call("/api/v1/submissions:POST", {
    user: { email: "author@example.com" },
    body: payload.body,
    file: payload.file
  });
  assert.equal(result.status, 400);
  assert.ok(result.body.errors.length >= 3);

  const mine = system.call("/api/v1/submissions/mine:GET", { user: { email: "author@example.com" } });
  assert.equal(mine.body.submissions.length, 0);
});
