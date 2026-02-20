import test from "node:test";
import assert from "node:assert/strict";
import { renderValidationResult } from "../../../frontend/src/views/form_validation_view.js";

test("validation feedback message is immediate and explicit", () => {
  const msg = renderValidationResult({ status: 422, body: {} });
  assert.equal(msg, "Please fix highlighted field errors.");
});
