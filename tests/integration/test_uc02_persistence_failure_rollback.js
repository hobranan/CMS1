import test from "node:test";
import assert from "node:assert/strict";
import { createUc02System } from "../helpers/uc02_system.js";
import { validCreatePayload } from "../contract/fixtures/validation_payloads.js";

test("persistence failure returns retry guidance and keeps previous state", () => {
  const system = createUc02System();
  system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: validCreatePayload
  });
  system.atomicPersistence.forceNextFailure();
  const result = system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: {
      ...validCreatePayload,
      operation: "update",
      data: { ...validCreatePayload.data, age: 31 }
    }
  });

  assert.equal(result.status, 500);
  assert.equal(result.body.code, "PERSISTENCE_FAILED");
  assert.equal(system.formSubmissionRepository.getRecord("record-1").age, 30);
});
