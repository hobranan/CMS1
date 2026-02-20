import test from "node:test";
import assert from "node:assert/strict";
import { makeError } from "../../backend/src/services/validation/validation_error_mapper.js";

test("validation errors do not include sensitive field values", () => {
  const err = makeError("password", "INVALID_FORMAT", "password format is invalid.");
  assert.equal("value" in err, false);
});
