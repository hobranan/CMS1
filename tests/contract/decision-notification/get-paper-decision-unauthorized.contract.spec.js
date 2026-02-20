import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("unauthorized author paper access returns 403", () => {
  const system = createUc15System();
  const owner = system.addAuthor("owner15@example.com");
  const other = system.addAuthor("other15@example.com");
  const editor = system.addEditor("e15-3@example.com");
  system.seedPaper({ paperId: "p15-3", editorId: editor.id, authors: [owner.id], completedReviewCount: 1 });

  const response = system.call("/api/v1/author/papers/:paperId/decision:GET", {
    params: { paperId: "p15-3" },
    user: { id: other.id, email: other.email, role: "author" }
  });

  assert.equal(response.status, 403);
});
