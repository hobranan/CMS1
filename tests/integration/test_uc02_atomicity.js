import test from "node:test";
import assert from "node:assert/strict";
import { createUc02System } from "../helpers/uc02_system.js";
import { validCreatePayload } from "../contract/fixtures/validation_payloads.js";

test("no partial update is stored when validation fails", () => {
  const system = createUc02System();
  const good = system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: validCreatePayload
  });
  assert.equal(good.status, 200);

  const bad = system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: {
      ...validCreatePayload,
      operation: "update",
      data: { ...validCreatePayload.data, email: "broken" }
    }
  });
  assert.equal(bad.status, 422);

  const record = system.formSubmissionRepository.getRecord("record-1");
  assert.equal(record.email, "alex@example.com");
});
