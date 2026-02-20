import test from "node:test";
import assert from "node:assert/strict";
import { submitManuscriptUpload } from "../../../frontend/src/controllers/upload/manuscript-upload-controller.js";

test("cancel selection causes no upload side effects", () => {
  const result = submitManuscriptUpload(() => ({ status: 500 }), "sub-1", null, { email: "author@example.com" });
  assert.equal(result.status, 400);
  assert.equal(result.body.code, "NO_FILE_SELECTED");
});
