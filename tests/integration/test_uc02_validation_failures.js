import test from "node:test";
import assert from "node:assert/strict";
import { createUc02System } from "../helpers/uc02_system.js";
import { validCreatePayload } from "../contract/fixtures/validation_payloads.js";

test("missing/invalid/business violations return deterministic all-errors output", () => {
  const system = createUc02System();
  const result = system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: {
      ...validCreatePayload,
      data: { firstName: "", lastName: "", email: "bad", age: 15 }
    }
  });
  assert.equal(result.status, 422);
  assert.deepEqual(
    result.body.errors.map((e) => e.code),
    ["REQUIRED_FIELD_MISSING", "REQUIRED_FIELD_MISSING", "INVALID_FORMAT", "AGE_MINIMUM"]
  );
});
