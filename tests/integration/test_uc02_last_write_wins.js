import test from "node:test";
import assert from "node:assert/strict";
import { createUc02System } from "../helpers/uc02_system.js";
import { validCreatePayload } from "../contract/fixtures/validation_payloads.js";

test("concurrent-style updates use last-write-wins", () => {
  const system = createUc02System();
  system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: validCreatePayload
  });

  system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: {
      ...validCreatePayload,
      operation: "update",
      data: { ...validCreatePayload.data, firstName: "Taylor" }
    }
  });
  system.call("/api/v1/forms/submit:POST", {
    user: { id: "u1" },
    body: {
      ...validCreatePayload,
      operation: "update",
      data: { ...validCreatePayload.data, firstName: "Jordan" }
    }
  });

  const record = system.formSubmissionRepository.getRecord("record-1");
  assert.equal(record.firstName, "Jordan");
});
