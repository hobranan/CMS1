import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";

test("missing required fields return 400 with field-level errors", () => {
  const system = createUc03System();
  const result = system.call("/api/v1/auth/login:POST", { body: { email: "", password: "" } });
  assert.equal(result.status, 400);
  assert.equal(result.body.code, "REQUIRED_FIELDS_MISSING");
  assert.equal(result.body.errors.length, 2);
});
