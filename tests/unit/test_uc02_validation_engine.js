import test from "node:test";
import assert from "node:assert/strict";
import { getFormDefinition } from "../../backend/src/models/form_definition_repository.js";
import { validateSubmission } from "../../backend/src/services/validation/validation_engine.js";

test("validation engine uses required -> format -> business ordering", () => {
  const def = getFormDefinition("profile_form");
  const result = validateSubmission(def, { firstName: "", lastName: "", email: "bad", age: 12 });
  assert.deepEqual(
    result.errors.map((e) => e.code),
    ["REQUIRED_FIELD_MISSING", "REQUIRED_FIELD_MISSING", "INVALID_FORMAT", "AGE_MINIMUM"]
  );
});
