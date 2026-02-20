import test from "node:test";
import assert from "node:assert/strict";
import { createUc02System } from "../helpers/uc02_system.js";
import { validCreatePayload } from "./fixtures/validation_payloads.js";

test("validation endpoint accepts valid payload", () => {
  const system = createUc02System();
  const result = system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: validCreatePayload
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.status, "ACCEPTED");
});

test("validation endpoint rejects invalid payload with field errors", () => {
  const system = createUc02System();
  const result = system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: {
      ...validCreatePayload,
      data: { firstName: "", email: "bad", age: 12 }
    }
  });
  assert.equal(result.status, 422);
  assert.equal(result.body.code, "VALIDATION_FAILED");
  assert.ok(Array.isArray(result.body.errors));
});
