import test from "node:test";
import assert from "node:assert/strict";
import { createUc02System } from "../helpers/uc02_system.js";
import { validCreatePayload } from "../contract/fixtures/validation_payloads.js";

test("valid submission persists record", () => {
  const system = createUc02System();
  const result = system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: validCreatePayload
  });
  assert.equal(result.status, 200);
  const saved = system.formSubmissionRepository.getRecord("record-1");
  assert.ok(saved);
  assert.equal(saved.email, "alex@example.com");
});
